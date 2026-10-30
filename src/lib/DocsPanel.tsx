import { Extension, Node as TiptapNode, mergeAttributes, type Editor, type Range } from '@tiptap/core';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import Mention from '@tiptap/extension-mention';
import { TableKit } from '@tiptap/extension-table';
import { Placeholder } from '@tiptap/extensions';
import { NodeSelection, PluginKey } from '@tiptap/pm/state';
import { EditorContent, NodeViewWrapper, ReactNodeViewRenderer, useEditor, type NodeViewProps } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Suggestion, { type SuggestionOptions, type SuggestionProps } from '@tiptap/suggestion';
import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
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
import { IsoDiagramEditor } from './IsoDiagramEditor';
import { detailSize } from './levels';
import { StaticDiagram } from './render';
import { KIND_NAMES, emptyDiagram, parseDiagram } from './shapes';
import type { Diagram, DocTarget } from './types';
import { useTheme } from './theme';
import { Icon } from './ui';

/** The detail diagram of the component a doc belongs to, and what can be done with it. */
export interface DocDetail {
  diagram?: Diagram;
  /** Go into it; absent when it is already showing. */
  onOpen?: () => void;
  /** Give the component a detail diagram; absent when it has one or the doc is read-only. */
  onAdd?: () => void;
}

/** Lets a doc's detail block show the detail diagram of the component the doc belongs to. */
export const DetailContext = createContext<DocDetail | undefined>(undefined);

export interface DocsPanelProps {
  target: DocTarget;
  diagram: Diagram;
  readOnly?: boolean;
  /** Levels above the page, top first; each goes to that level's overview. */
  levels?: { label: string; onClick: () => void }[];
  /** The page is the overview of the detail diagram on screen (the target component's own doc). */
  overview?: boolean;
  /** Set when the page is a component that can have a detail diagram. */
  detail?: DocDetail;
  onChange: (target: DocTarget, markdown: string) => void;
  /** Go to another item (from a breadcrumb or a mention). */
  onNavigate: (target: DocTarget) => void;
  onMentionHover?: (target: DocTarget | null) => void;
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


// ---------- embedded diagrams ----------

function readEmbedded(json: string): Diagram {
  try {
    return json.trim() ? parseDiagram(JSON.parse(json)) : emptyDiagram();
  } catch {
    return emptyDiagram();
  }
}

/** Full-screen editor for a diagram embedded in a doc. */
function EmbedEditorModal({ initial, onSave, onCancel }: { initial: Diagram; onSave: (d: Diagram) => void; onCancel: () => void }) {
  const [draft, setDraft] = useState(initial);
  // Portaled to <body>, outside the editor's themed root, so it carries the theme itself.
  const theme = useTheme();
  return (
    <div
      className="isd-modal"
      data-theme={theme}
      role="dialog"
      aria-modal="true"
      aria-label="Edit embedded diagram"
      // Keep keys and drops inside the modal: the outer editor is a React ancestor through the portal.
      onKeyDown={(e) => e.stopPropagation()}
      onDrop={(e) => e.stopPropagation()}
      onDragOver={(e) => e.stopPropagation()}
    >
      <div className="isd-modal-box">
        <header className="isd-modal-head">
          <strong>Embedded diagram</strong>
          <span>Shown inside this doc. Use it for the internals of a component: data flow, sub-services, sequences.</span>
          <div className="isd-modal-actions">
            <button type="button" className="isd-btn" onClick={onCancel}>
              Cancel
            </button>
            <button type="button" className="isd-btn is-primary" onClick={() => onSave(draft)}>
              Save diagram
            </button>
          </div>
        </header>
        <IsoDiagramEditor defaultValue={initial} onChange={setDraft} className="isd-modal-editor" />
      </div>
    </div>
  );
}

/** Where a component's doc shows its detail diagram. Read from the doc's DetailContext. */
function DetailBlockView({ selected, editor }: NodeViewProps) {
  const detail = useContext(DetailContext);
  const d = detail?.diagram;
  const editable = editor.isEditable;
  return (
    <NodeViewWrapper className={`isd-embed is-detail${selected && editable ? ' is-selected' : ''}`} contentEditable={false}>
      <div className="isd-embed-bar">
        <span>
          <Icon name="layers" size={13} /> Detail diagram{d ? ` · ${detailSize(d)} item${detailSize(d) === 1 ? '' : 's'}` : ''}
        </span>
        {detail?.onOpen && (
          <button type="button" className="isd-doc-btn" onClick={detail.onOpen}>
            Open ↘
          </button>
        )}
      </div>
      {d?.nodes.length ? (
        <div className="isd-embed-canvas" onDoubleClick={detail?.onOpen}>
          <StaticDiagram diagram={d} maxHeight={360} label="Detail diagram" />
        </div>
      ) : (
        <div className="isd-embed-empty">
          {!detail
            ? 'Detail diagrams belong to components.'
            : d
              ? 'The detail diagram is empty.'
              : 'This component has no detail diagram yet.'}
          {detail?.onAdd && editable && (
            <>
              {' '}
              <button type="button" className="isd-doc-btn" onClick={detail.onAdd}>
                Add one
              </button>
            </>
          )}
        </div>
      )}
    </NodeViewWrapper>
  );
}

function DiagramEmbedView(props: NodeViewProps) {
  return props.node.attrs.detail ? <DetailBlockView {...props} /> : <FreeEmbedView {...props} />;
}

function FreeEmbedView({ node, updateAttributes, editor, selected }: NodeViewProps) {
  const diagram = useMemo(() => readEmbedded(node.attrs.diagram as string), [node.attrs.diagram]);
  const [open, setOpen] = useState(false);
  const editable = editor.isEditable;
  // A block just inserted with /Diagram opens its editor straight away.
  useEffect(() => {
    if (node.attrs.autoOpen && editable) {
      setOpen(true);
      updateAttributes({ autoOpen: false });
    }
  }, [node.attrs.autoOpen, editable]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <NodeViewWrapper className={`isd-embed${selected && editable ? ' is-selected' : ''}`} contentEditable={false}>
      {editable && (
        <div className="isd-embed-bar">
          <span>Diagram</span>
          <button type="button" className="isd-doc-btn" onClick={() => setOpen(true)}>
            Edit diagram
          </button>
        </div>
      )}
      {diagram.nodes.length ? (
        <div className="isd-embed-canvas" onDoubleClick={() => editable && setOpen(true)}>
          <StaticDiagram diagram={diagram} maxHeight={360} label="Embedded diagram" />
        </div>
      ) : (
        <div className="isd-embed-empty">{editable ? 'Empty diagram. Click Edit diagram to draw one.' : 'Empty diagram.'}</div>
      )}
      {open &&
        createPortal(
          <EmbedEditorModal
            initial={diagram}
            onCancel={() => setOpen(false)}
            onSave={(d) => {
              updateAttributes({ diagram: JSON.stringify({ version: 1, nodes: d.nodes, edges: d.edges, ...(d.doc ? { doc: d.doc } : {}) }) });
              setOpen(false);
            }}
          />,
          document.body,
        )}
    </NodeViewWrapper>
  );
}

/**
 * An IsoDraw diagram inside a doc. Stored in Markdown as a fenced block,
 * ```isodraw followed by the diagram JSON, so the doc stays plain Markdown.
 * An empty ```isodraw-detail block shows the component's detail diagram instead.
 */
const DiagramEmbed = TiptapNode.create({
  name: 'isodrawDiagram',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      diagram: { default: '' },
      detail: { default: false },
      // Transient: set by /Diagram, cleared once the editor opens; never written to Markdown or HTML.
      autoOpen: { default: false, rendered: false, parseHTML: () => false },
    };
  },
  parseHTML() {
    return [
      {
        // Beats the code block rule for fenced ```isodraw blocks.
        tag: 'pre',
        priority: 60,
        getAttrs: (el: HTMLElement) => {
          const code = el.querySelector('code');
          if (code && /\blanguage-isodraw-detail\b/.test(code.className)) return { diagram: '', detail: true };
          return code && /\blanguage-isodraw(?![\w-])/.test(code.className) ? { diagram: code.textContent ?? '' } : false;
        },
      },
      {
        tag: 'div[data-type="isodraw-diagram"]',
        getAttrs: (el: HTMLElement) => ({ diagram: el.getAttribute('data-diagram') ?? '', detail: el.hasAttribute('data-detail') }),
      },
    ];
  },
  renderHTML({ node }) {
    return ['div', { 'data-type': 'isodraw-diagram', 'data-diagram': node.attrs.diagram, ...(node.attrs.detail ? { 'data-detail': '' } : {}) }];
  },
  addNodeView() {
    return ReactNodeViewRenderer(DiagramEmbedView);
  },
  addStorage() {
    return {
      markdown: {
        serialize(
          state: { write: (s: string) => void; ensureNewLine: () => void; closeBlock: (n: unknown) => void },
          node: { attrs: { diagram: string; detail: boolean } },
        ) {
          if (node.attrs.detail) {
            state.write('```isodraw-detail');
            state.ensureNewLine();
            state.write('```');
            state.closeBlock(node);
            return;
          }
          const json = node.attrs.diagram?.trim() || JSON.stringify(emptyDiagram());
          state.write('```isodraw');
          state.ensureNewLine();
          state.write(json);
          state.ensureNewLine();
          state.write('```');
          state.closeBlock(node);
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
  {
    title: 'Diagram',
    hint: 'isodraw',
    run: (e, r) => e.chain().focus().deleteRange(r).insertContent({ type: 'isodrawDiagram', attrs: { diagram: '', autoOpen: true } }).run(),
  },
  {
    title: 'Detail diagram',
    hint: 'this component',
    run: (e, r) => e.chain().focus().deleteRange(r).insertContent({ type: 'isodrawDiagram', attrs: { diagram: '', detail: true } }).run(),
  },
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

export function DocEditor({
  markdown,
  editable,
  items,
  onChange,
  onNavigate,
  onMentionHover,
  allowDetail = false,
}: {
  markdown: string;
  editable: boolean;
  /** Offer the "Detail diagram" block: the doc belongs to a component. */
  allowDetail?: boolean;
  items: () => Mentionable[];
  onChange: (md: string) => void;
  onNavigate: (t: DocTarget) => void;
  /** The pointer moved onto a mention (its target) or off it (null). */
  onMentionHover?: (t: DocTarget | null) => void;
}) {
  const [mentionPopup, setMentionPopup] = useState<PopupState<MentionItem> | null>(null);
  const [slashPopup, setSlashPopup] = useState<PopupState<SlashItem> | null>(null);
  const [bubble, setBubble] = useState<{ x: number; y: number; below: boolean } | null>(null);
  const [tableMenu, setTableMenu] = useState<{ x: number; y: number; below: boolean } | null>(null);
  const mentionRef = useRef(mentionPopup);
  const slashRef = useRef(slashPopup);
  mentionRef.current = mentionPopup;
  slashRef.current = slashPopup;
  const latest = useRef({ onChange, onNavigate, onMentionHover, items, allowDetail });
  latest.current = { onChange, onNavigate, onMentionHover, items, allowDetail };
  const hovered = useRef<string | null>(null);
  const reportHover = (el: EventTarget | null) => {
    const href = (el as HTMLElement | null)?.closest?.('a')?.getAttribute('href') ?? '';
    const t = parseMentionHref(href);
    const key = t ? targetKey(t) : null;
    if (key === hovered.current) return;
    hovered.current = key;
    latest.current.onMentionHover?.(t);
  };
  // Clear a highlight left behind when the editor goes away mid-hover.
  useEffect(() => () => {
    if (hovered.current) latest.current.onMentionHover?.(null);
  }, []);
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
      DiagramEmbed,
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
          items: ({ query }) =>
            SLASH_ITEMS.filter(
              (i) => i.title.toLowerCase().includes(query.toLowerCase()) && (i.title !== 'Detail diagram' || latest.current.allowDetail),
            ),
          command: ({ editor: e, range, props }) => props.run(e, range),
          render: suggestionRenderer<SlashItem>(setSlash, () => slashRef.current),
        },
      }),
    ],
    editorProps: {
      handleDOMEvents: {
        mouseover: (_view, event) => {
          reportHover(event.target);
          return false;
        },
        mouseleave: () => {
          reportHover(null);
          return false;
        },
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
      // Table menu: anchored to the current cell while the cursor is in a table.
      const at = e.view.domAtPos(from).node;
      const cell = (at instanceof Element ? at : at.parentElement)?.closest('td, th');
      if (cell && empty && e.isEditable && box) {
        const r = cell.getBoundingClientRect();
        const half = 150;
        const top = r.top - box.top;
        const below = top < 48;
        setTableMenu({
          x: Math.min(Math.max(r.left + r.width / 2 - box.left, half + 4), box.width - half - 4),
          y: below ? r.bottom - box.top : top,
          below,
        });
      } else {
        setTableMenu(null);
      }
      // A selected block (like an embedded diagram) gets no text formatting menu.
      if (empty || !e.isEditable || !box || e.state.selection instanceof NodeSelection) {
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
    onBlur: () => {
      setBubble(null);
      setTableMenu(null);
    },
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

      {tableMenu && editor.isActive('table') && (
        <div className={`isd-doc-bubble${tableMenu.below ? ' is-below' : ''}`} style={{ left: tableMenu.x, top: tableMenu.y }}>
          <span className="isd-doc-bubble-label">Row</span>
          {btn('+↑', 'Insert row above', false, () => chain().addRowBefore().run())}
          {btn('+↓', 'Insert row below', false, () => chain().addRowAfter().run())}
          {btn('✕', 'Delete row', false, () => chain().deleteRow().run())}
          <span className="isd-doc-bubble-label">Col</span>
          {btn('+←', 'Insert column left', false, () => chain().addColumnBefore().run())}
          {btn('+→', 'Insert column right', false, () => chain().addColumnAfter().run())}
          {btn('✕', 'Delete column', false, () => chain().deleteColumn().run())}
          {btn('H', 'Toggle header row', false, () => chain().toggleHeaderRow().run())}
          {btn(<Icon name="trash" size={14} />, 'Delete table', false, () => chain().deleteTable().run())}
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

export default function DocsPanel({
  target,
  diagram,
  readOnly,
  levels = [{ label: 'Diagram', onClick: () => onNavigate({ kind: 'diagram' }) }],
  overview,
  detail,
  onChange,
  onNavigate,
  onMentionHover,
  onClose,
  onExport,
}: DocsPanelProps) {
  /** Areas the item sits in, on its own level. */
  const areas = breadcrumbs(target, diagram).slice(1);
  const title = titleOf(target, diagram);
  const md = docOf(target, diagram);
  const diagramRef = useRef(diagram);
  diagramRef.current = diagram;
  const [notice, setNotice] = useState<string | null>(null);
  const kindName =
    target.kind === 'diagram'
      ? 'Overview'
      : target.kind === 'edge'
        ? 'Connection'
        : KIND_NAMES[diagram.nodes.find((n) => n.id === target.id)?.kind ?? 'block'];
  const kind = overview ? `Overview · ${kindName}` : kindName;

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
          {levels.map((c, i) => (
            <span key={i}>
              <button type="button" onClick={c.onClick}>
                {c.label}
              </button>
              <span aria-hidden>›</span>
            </span>
          ))}
        </nav>
        <div className="isd-docs-title">
          <div>
            <h2>{target.kind === 'diagram' ? 'Diagram overview' : title}</h2>
            <small>
              {kind}
              {areas.length > 0 && (
                <span className="isd-docs-areas">
                  {' '}
                  in{' '}
                  {areas.map((c, i) => (
                    <span key={targetKey(c)}>
                      {i > 0 && ' › '}
                      <button type="button" onClick={() => onNavigate(c)}>
                        {titleOf(c, diagram)}
                      </button>
                    </span>
                  ))}
                </span>
              )}
            </small>
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
      {detail && (detail.onOpen || detail.onAdd) && (
        <div className="isd-docs-detail">
          <Icon name="layers" size={14} />
          {detail.diagram ? (
            <>
              <span>
                Detail diagram · {detailSize(detail.diagram)} item{detailSize(detail.diagram) === 1 ? '' : 's'}
              </span>
              <button type="button" className="isd-doc-btn" onClick={detail.onOpen}>
                Open ↘
              </button>
            </>
          ) : (
            <button type="button" className="isd-doc-btn" onClick={detail.onAdd}>
              Add detail diagram
            </button>
          )}
        </div>
      )}
      {readOnly && !md.trim() ? (
        <p className="isd-docs-empty">No documentation for this {target.kind === 'diagram' ? 'diagram' : 'item'} yet.</p>
      ) : (
        <DetailContext.Provider value={detail}>
        <DocEditor
          key={targetKey(target)}
          markdown={md}
          editable={!readOnly}
          allowDetail={!!detail}
          items={() => mentionables(diagramRef.current)}
          onChange={(next) => onChange(target, next)}
          onNavigate={navigate}
          onMentionHover={onMentionHover}
        />
        </DetailContext.Provider>
      )}
    </aside>
  );
}
