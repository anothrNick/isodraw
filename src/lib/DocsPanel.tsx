import { Extension, mergeAttributes, type Editor, type Range } from '@tiptap/core';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import Mention from '@tiptap/extension-mention';
import { TableKit } from '@tiptap/extension-table';
import { Placeholder } from '@tiptap/extensions';
import { PluginKey } from '@tiptap/pm/state';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Suggestion, { type SuggestionOptions, type SuggestionProps } from '@tiptap/suggestion';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Markdown } from 'tiptap-markdown';
import {
  MENTION_SCHEME,
  breadcrumbs,
  docOf,
  exists,
  mentionables,
  parseMentionHref,
  targetKey,
  titleOf,
  type Mentionable,
} from './docs';
import { KIND_NAMES } from './shapes';
import type { Diagram, DocTarget } from './types';
import { Icon } from './ui';

export interface DocsPanelProps {
  target: DocTarget;
  diagram: Diagram;
  readOnly?: boolean;
  onChange: (target: DocTarget, markdown: string) => void;
  /** Go to another item (from a breadcrumb or a mention). */
  onNavigate: (target: DocTarget) => void;
  onClose: () => void;
  onExport: () => void;
}

// ---------- suggestion popups (shared by @ mentions and / commands) ----------

interface PopupState<T> {
  items: T[];
  index: number;
  rect: DOMRect | null;
  select: (item: T) => void;
}

/** Bridge a Tiptap suggestion to React state so the popup renders like any other component. */
function suggestionRenderer<T>(set: (s: PopupState<T> | null) => void, get: () => PopupState<T> | null) {
  return () => {
    const toState = (p: SuggestionProps<T>, index = 0): PopupState<T> => ({
      items: p.items,
      index: Math.min(index, Math.max(0, p.items.length - 1)),
      rect: p.clientRect?.() ?? null,
      select: (item: T) => p.command(item),
    });
    return {
      onStart: (p: SuggestionProps<T>) => set(toState(p)),
      onUpdate: (p: SuggestionProps<T>) => set(toState(p, get()?.index ?? 0)),
      onKeyDown: ({ event }: { event: KeyboardEvent }) => {
        const s = get();
        if (!s || !s.items.length) return false;
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          const n = s.items.length;
          set({ ...s, index: (s.index + (event.key === 'ArrowDown' ? 1 : n - 1)) % n });
          return true;
        }
        if (event.key === 'Enter' || event.key === 'Tab') {
          s.select(s.items[s.index]);
          return true;
        }
        if (event.key === 'Escape') {
          set(null);
          return true;
        }
        return false;
      },
      onExit: () => set(null),
    };
  };
}

// ---------- mention node ----------

interface MentionItem {
  id: string;
  label: string;
  kind: string;
}

const escapeLabel = (s: string) => s.replace(/([[\]\\])/g, '\\$1');

/** Best matches first: name starts with the query, then a word does, then anywhere; nodes before connections. */
function rankMentions(all: Mentionable[], query: string): Mentionable[] {
  const q = query.trim().toLowerCase();
  const score = (m: Mentionable) => {
    const t = m.title.toLowerCase();
    if (!q) return 0;
    if (t.startsWith(q)) return 0;
    if (new RegExp(`\\b${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(t)) return 1;
    if (t.includes(q)) return 2;
    if (m.kind.toLowerCase().includes(q)) return 3;
    return -1;
  };
  return all
    .map((m) => ({ m, s: score(m) }))
    .filter((x) => x.s >= 0)
    .sort((a, b) => a.s - b.s || Number(a.m.target.kind === 'edge') - Number(b.m.target.kind === 'edge') || a.m.title.length - b.m.title.length)
    .map((x) => x.m);
}

/**
 * `@` mentions of diagram items. Stored in Markdown as `[@Label](isodraw:node/id)`
 * and read back from those links, so docs stay plain Markdown.
 */
const ItemMention = Mention.extend({
  parseHTML() {
    return [
      {
        tag: `a[href^="${MENTION_SCHEME}"]`,
        priority: 100,
        getAttrs: (el: HTMLElement) => {
          const t = parseMentionHref(el.getAttribute('href') ?? '');
          return t ? { id: targetKey(t), label: (el.textContent ?? '').replace(/^@/, '') } : false;
        },
      },
    ];
  },
  renderHTML({ node, HTMLAttributes }) {
    return [
      'a',
      mergeAttributes(HTMLAttributes, { href: `${MENTION_SCHEME}${node.attrs.id}`, class: 'isd-mention', 'data-type': 'mention' }),
      `@${node.attrs.label ?? node.attrs.id}`,
    ];
  },
  renderText({ node }) {
    return `@${node.attrs.label ?? node.attrs.id}`;
  },
  addStorage() {
    return {
      markdown: {
        serialize(state: { write: (s: string) => void }, node: { attrs: { id: string; label?: string } }) {
          state.write(`[@${escapeLabel(node.attrs.label ?? node.attrs.id)}](${MENTION_SCHEME}${node.attrs.id})`);
        },
        parse: {},
      },
    };
  },
});

// ---------- slash commands ----------

interface SlashItem {
  title: string;
  hint: string;
  run: (editor: Editor, range: Range) => void;
}

const SLASH_ITEMS: SlashItem[] = [
  { title: 'Heading 1', hint: '#', run: (e, r) => e.chain().focus().deleteRange(r).setNode('heading', { level: 1 }).run() },
  { title: 'Heading 2', hint: '##', run: (e, r) => e.chain().focus().deleteRange(r).setNode('heading', { level: 2 }).run() },
  { title: 'Heading 3', hint: '###', run: (e, r) => e.chain().focus().deleteRange(r).setNode('heading', { level: 3 }).run() },
  { title: 'Bullet list', hint: '-', run: (e, r) => e.chain().focus().deleteRange(r).toggleBulletList().run() },
  { title: 'Numbered list', hint: '1.', run: (e, r) => e.chain().focus().deleteRange(r).toggleOrderedList().run() },
  { title: 'Task list', hint: '[ ]', run: (e, r) => e.chain().focus().deleteRange(r).toggleTaskList().run() },
  { title: 'Quote', hint: '>', run: (e, r) => e.chain().focus().deleteRange(r).toggleBlockquote().run() },
  { title: 'Code block', hint: '```', run: (e, r) => e.chain().focus().deleteRange(r).toggleCodeBlock().run() },
  {
    title: 'Table',
    hint: '3×3',
    run: (e, r) => e.chain().focus().deleteRange(r).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
  },
  { title: 'Divider', hint: '---', run: (e, r) => e.chain().focus().deleteRange(r).setHorizontalRule().run() },
  { title: 'Link a component', hint: '@', run: (e, r) => e.chain().focus().deleteRange(r).insertContent('@').run() },
];

const SlashCommands = Extension.create<{ suggestion: Omit<SuggestionOptions<SlashItem>, 'editor'> }>({
  name: 'slashCommands',
  addOptions() {
    return { suggestion: { char: '/' } as Omit<SuggestionOptions<SlashItem>, 'editor'> };
  },
  addProseMirrorPlugins() {
    return [Suggestion<SlashItem>({ editor: this.editor, pluginKey: new PluginKey('isdSlash'), ...this.options.suggestion })];
  },
});

// ---------- editor ----------

type MarkdownStorage = { markdown: { getMarkdown: () => string } };
const getMarkdown = (e: Editor) => (e.storage as unknown as MarkdownStorage).markdown.getMarkdown();

function DocEditor({
  markdown,
  editable,
  items,
  onChange,
  onNavigate,
}: {
  markdown: string;
  editable: boolean;
  items: () => Mentionable[];
  onChange: (md: string) => void;
  onNavigate: (t: DocTarget) => void;
}) {
  const [mentionPopup, setMentionPopup] = useState<PopupState<MentionItem> | null>(null);
  const [slashPopup, setSlashPopup] = useState<PopupState<SlashItem> | null>(null);
  const [bubble, setBubble] = useState<{ x: number; y: number; below: boolean } | null>(null);
  const mentionRef = useRef(mentionPopup);
  const slashRef = useRef(slashPopup);
  mentionRef.current = mentionPopup;
  slashRef.current = slashPopup;
  const latest = useRef({ onChange, onNavigate, items });
  latest.current = { onChange, onNavigate, items };
  const emitted = useRef(markdown);
  const wrapRef = useRef<HTMLDivElement>(null);

  const setMention = (s: PopupState<MentionItem> | null) => {
    mentionRef.current = s;
    setMentionPopup(s);
  };
  const setSlash = (s: PopupState<SlashItem> | null) => {
    slashRef.current = s;
    setSlashPopup(s);
  };

  const editor = useEditor({
    editable,
    immediatelyRender: true,
    shouldRerenderOnTransaction: true,
    content: markdown,
    extensions: [
      StarterKit.configure({ link: { openOnClick: false, autolink: true, linkOnPaste: true } }),
      Placeholder.configure({
        placeholder: ({ editor: e }) => (e.isEmpty ? 'Write documentation… type / for blocks, @ to link a component' : ''),
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      TableKit.configure({ table: { resizable: false } }),
      Markdown.configure({ html: true, linkify: true, transformPastedText: true, transformCopiedText: true, breaks: false }),
      ItemMention.configure({
        suggestion: {
          char: '@',
          items: ({ query }) =>
            rankMentions(latest.current.items(), query)
              .slice(0, 8)
              .map((m) => ({ id: targetKey(m.target), label: m.title, kind: m.kind })),
          render: suggestionRenderer<MentionItem>(setMention, () => mentionRef.current),
        },
      }),
      SlashCommands.configure({
        suggestion: {
          char: '/',
          startOfLine: false,
          items: ({ query }) => SLASH_ITEMS.filter((i) => i.title.toLowerCase().includes(query.toLowerCase())),
          command: ({ editor: e, range, props }) => props.run(e, range),
          render: suggestionRenderer<SlashItem>(setSlash, () => slashRef.current),
        },
      }),
    ],
    editorProps: {
      handleDOMEvents: {
        click: (_view, event) => {
          const a = (event.target as HTMLElement).closest('a');
          const href = a?.getAttribute('href');
          if (!href) return false;
          const t = parseMentionHref(href);
          if (t) {
            event.preventDefault();
            latest.current.onNavigate(t);
            return true;
          }
          // Ordinary links open in a new tab when reading, or with ⌘/Ctrl while editing.
          if (!editable || event.metaKey || event.ctrlKey) {
            event.preventDefault();
            window.open(href, '_blank', 'noopener');
            return true;
          }
          return false;
        },
      },
    },
    onUpdate: ({ editor: e }) => {
      const md = getMarkdown(e);
      emitted.current = md;
      latest.current.onChange(md);
    },
    onSelectionUpdate: ({ editor: e }) => {
      const { from, to, empty } = e.state.selection;
      const box = wrapRef.current?.getBoundingClientRect();
      if (empty || !e.isEditable || !box) {
        setBubble(null);
        return;
      }
      const a = e.view.coordsAtPos(from);
      const b = e.view.coordsAtPos(to);
      // Keep the menu inside the panel; flip below the selection near the top.
      const half = 80;
      const x = Math.min(Math.max((a.left + b.right) / 2 - box.left, half + 4), box.width - half - 4);
      const top = Math.min(a.top, b.top) - box.top;
      const below = top < 48;
      setBubble({ x, y: below ? Math.max(a.bottom, b.bottom) - box.top : top, below });
    },
    onBlur: () => setBubble(null),
  });

  // Pick up outside changes (undo/redo) without clobbering what the user just typed.
  useEffect(() => {
    if (!editor || markdown === emitted.current) return;
    if (markdown !== getMarkdown(editor)) editor.commands.setContent(markdown, { emitUpdate: false });
    emitted.current = markdown;
  }, [editor, markdown]);

  useEffect(() => {
    editor?.setEditable(editable);
  }, [editor, editable]);

  // Keep the highlighted suggestion visible while arrowing through a long list.
  useEffect(() => {
    for (const list of wrapRef.current?.querySelectorAll<HTMLElement>('.isd-doc-popup') ?? []) {
      const item = list.querySelector<HTMLElement>('[aria-selected="true"]');
      if (!item) continue;
      if (item.offsetTop < list.scrollTop) list.scrollTop = item.offsetTop - 4;
      else if (item.offsetTop + item.offsetHeight > list.scrollTop + list.clientHeight) {
        list.scrollTop = item.offsetTop + item.offsetHeight - list.clientHeight + 4;
      }
    }
  }, [mentionPopup?.index, slashPopup?.index, mentionPopup?.items, slashPopup?.items]);

  if (!editor) return null;

  const btn = (label: ReactNode, title: string, active: boolean, run: () => void) => (
    <button
      type="button"
      title={title}
      aria-label={title}
      className={`isd-doc-btn${active ? ' is-active' : ''}`}
      onMouseDown={(e) => e.preventDefault()}
      onClick={run}
    >
      {label}
    </button>
  );
  const chain = () => editor.chain().focus();
  const setLink = () => {
    const prev = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Link URL', prev ?? 'https://');
    if (url === null) return;
    if (!url.trim()) chain().extendMarkRange('link').unsetLink().run();
    else chain().extendMarkRange('link').setLink({ href: url.trim() }).run();
  };

  const popupBox = wrapRef.current?.getBoundingClientRect();
  const popupPos = (rect: DOMRect | null) =>
    rect && popupBox ? { left: Math.max(4, rect.left - popupBox.left), top: rect.bottom - popupBox.top + 6 } : { left: 8, top: 8 };

  return (
    <div className="isd-doc-editor" ref={wrapRef}>
      {editable && editor.isActive('table') && (
        <div className="isd-doc-tablebar">
          {btn('+ Row', 'Add row below', false, () => chain().addRowAfter().run())}
          {btn('+ Col', 'Add column after', false, () => chain().addColumnAfter().run())}
          {btn('− Row', 'Delete row', false, () => chain().deleteRow().run())}
          {btn('− Col', 'Delete column', false, () => chain().deleteColumn().run())}
          {btn('Delete table', 'Delete table', false, () => chain().deleteTable().run())}
        </div>
      )}
      <EditorContent editor={editor} className="isd-doc-content" />

      {bubble && (
        <div className={`isd-doc-bubble${bubble.below ? ' is-below' : ''}`} style={{ left: bubble.x, top: bubble.y }}>
          {btn(<b>B</b>, 'Bold', editor.isActive('bold'), () => chain().toggleBold().run())}
          {btn(<i>I</i>, 'Italic', editor.isActive('italic'), () => chain().toggleItalic().run())}
          {btn(<s>S</s>, 'Strikethrough', editor.isActive('strike'), () => chain().toggleStrike().run())}
          {btn(<code>{'<>'}</code>, 'Inline code', editor.isActive('code'), () => chain().toggleCode().run())}
          {btn(<Icon name="link" size={14} />, 'Link', editor.isActive('link'), setLink)}
        </div>
      )}

      {mentionPopup && (
        <div className="isd-doc-popup" style={popupPos(mentionPopup.rect)} role="listbox">
          {mentionPopup.items.length ? (
            mentionPopup.items.map((m, i) => (
              <button
                key={m.id}
                type="button"
                role="option"
                aria-selected={i === mentionPopup.index}
                className={i === mentionPopup.index ? 'is-active' : ''}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => mentionPopup.select(m)}
              >
                <span>{m.label}</span>
                <small>{m.kind}</small>
              </button>
            ))
          ) : (
            <div className="isd-doc-popup-empty">No matching components</div>
          )}
        </div>
      )}
      {slashPopup && slashPopup.items.length > 0 && (
        <div className="isd-doc-popup" style={popupPos(slashPopup.rect)} role="listbox">
          {slashPopup.items.map((m, i) => (
            <button
              key={m.title}
              type="button"
              role="option"
              aria-selected={i === slashPopup.index}
              className={i === slashPopup.index ? 'is-active' : ''}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => slashPopup.select(m)}
            >
              <span>{m.title}</span>
              <small>{m.hint}</small>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- panel ----------

export default function DocsPanel({ target, diagram, readOnly, onChange, onNavigate, onClose, onExport }: DocsPanelProps) {
  const crumbs = breadcrumbs(target, diagram);
  const title = titleOf(target, diagram);
  const md = docOf(target, diagram);
  const diagramRef = useRef(diagram);
  diagramRef.current = diagram;
  const [notice, setNotice] = useState<string | null>(null);
  const kind =
    target.kind === 'diagram'
      ? 'Overview'
      : target.kind === 'edge'
        ? 'Connection'
        : KIND_NAMES[diagram.nodes.find((n) => n.id === target.id)?.kind ?? 'block'];

  useEffect(() => setNotice(null), [target]);

  const navigate = (t: DocTarget) => {
    if (!exists(t, diagramRef.current)) {
      setNotice('That component no longer exists in the diagram.');
      return;
    }
    onNavigate(t);
  };

  return (
    <aside className="isd-docs" aria-label="Documentation">
      <header className="isd-docs-head">
        <nav className="isd-docs-crumbs" aria-label="Breadcrumbs">
          {crumbs.map((c) => (
            <span key={targetKey(c)}>
              <button type="button" onClick={() => onNavigate(c)}>
                {titleOf(c, diagram)}
              </button>
              <span aria-hidden>›</span>
            </span>
          ))}
        </nav>
        <div className="isd-docs-title">
          <div>
            <h2>{target.kind === 'diagram' ? 'Diagram overview' : title}</h2>
            <small>{kind}</small>
          </div>
          <button type="button" className="isd-drawer-close" aria-label="Export all docs as Markdown" title="Export all docs as Markdown" onClick={onExport} style={{ right: 40 }}>
            <Icon name="download" />
          </button>
          <button type="button" className="isd-drawer-close" aria-label="Close docs" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>
      </header>
      {notice && <div className="isd-docs-notice">{notice}</div>}
      {readOnly && !md.trim() ? (
        <p className="isd-docs-empty">No documentation for this {target.kind === 'diagram' ? 'diagram' : 'item'} yet.</p>
      ) : (
        <DocEditor
          key={targetKey(target)}
          markdown={md}
          editable={!readOnly}
          items={() => mentionables(diagramRef.current)}
          onChange={(next) => onChange(target, next)}
          onNavigate={navigate}
        />
      )}
    </aside>
  );
}
