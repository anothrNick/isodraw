import { readFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { CliError, Client, type DiagramMeta } from './client';
import { clearConfig, configPath, loadConfig, saveConfig } from './config';
import { describeText, outline } from './describe';
import { GUIDE } from './guide';
import { exportDocsMarkdown, iconTypes, importTerraform, isTerraformJson, layoutLevel, levelAt, parseDiagram, withLevel } from './lib';
import { browserLogin } from './login';
import { applyOps, findNode, OpError, parseLevel, resolveLevel, type Op } from './ops';

const HELP = `isodraw: work with IsoDraw diagrams and their docs from the command line.

Usage: isodraw <command> [options]   (add --json to any command for JSON output)

  login [--token isd_…] [--no-browser]   Sign in through the browser, or save a token
  logout                          Revoke this machine's token and forget it
  whoami                          Who you are, which workspace, read or write

  diagrams list
  diagrams create --title T [--file diagram.json]
  diagrams get <diagram>          The full diagram JSON
  diagrams rename <diagram> <title>
  diagrams delete <diagram> --yes

  describe <diagram> [--level a/b]     Components, areas, connections and docs of a level
  docs get <diagram> [--item X] [--level a/b]
  docs set <diagram> [--item X] [--level a/b] [--file doc.md]   (or Markdown on stdin)

  nodes add <diagram> --label L [--kind K] [--icon T] [--in AREA] [--near ITEM] [--doc-file F]
  nodes update <diagram> <item> [--label L] [--color #hex] [--kind K] [--icon T]
  nodes remove <diagram> <item>
  edges add <diagram> <from> <to> [--label L] [--style solid|dashed|dotted]
  edges update <diagram> <from> <to> [--label L] [--style S]
  edges remove <diagram> <from> <to>
  apply <diagram> --file changes.json [--dry-run]
  layout <diagram> [--level a/b]  Lay out a level in columns by flow (moves everything on it)

  import terraform <state-or-plan.json> [--title T]
  export <diagram> --format json|md
  icons [search]                  Icons for --icon, by Terraform resource type
  guide                           How AI agents should use this CLI

Diagrams are named by id or title, items by id or label. Server: --server,
ISODRAW_SERVER, or the saved config (${configPath()}). Token: ISODRAW_TOKEN or
\`isodraw login\`.`;

const { values: opt, positionals: args } = parseArgs({
  allowPositionals: true,
  strict: true,
  options: {
    json: { type: 'boolean' },
    server: { type: 'string' },
    token: { type: 'string' },
    level: { type: 'string' },
    item: { type: 'string' },
    label: { type: 'string' },
    kind: { type: 'string' },
    icon: { type: 'string' },
    color: { type: 'string' },
    in: { type: 'string' },
    near: { type: 'string' },
    'doc-file': { type: 'string' },
    file: { type: 'string' },
    title: { type: 'string' },
    style: { type: 'string' },
    format: { type: 'string' },
    'dry-run': { type: 'boolean' },
    yes: { type: 'boolean' },
    'no-browser': { type: 'boolean' },
    help: { type: 'boolean', short: 'h' },
  },
});

const config = loadConfig({ server: opt.server });
const client = new Client(config.server, config.token);

/** Print a result: JSON with --json, otherwise the text. */
function out(data: unknown, text?: string) {
  console.log(opt.json || text === undefined ? JSON.stringify(data, null, 2) : text);
}

function need(v: string | undefined, what: string): string {
  if (!v) throw new CliError(`Missing ${what}. Run \`isodraw --help\` for usage.`);
  return v;
}

async function readInput(file?: string): Promise<string> {
  if (file) return readFileSync(file === '-' ? 0 : file, 'utf8');
  if (process.stdin.isTTY) throw new CliError('Give the content with --file, or pipe it on stdin.');
  const chunks: Buffer[] = [];
  for await (const c of process.stdin) chunks.push(c as Buffer);
  return Buffer.concat(chunks).toString('utf8');
}

function readJson(text: string, what: string): unknown {
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new CliError(`${what} is not valid JSON: ${(e as Error).message}`);
  }
}

/** Apply ops to a diagram and save, reporting what changed. */
async function change(ref: string, ops: Op[], dryRun = false) {
  const level = parseLevel(opt.level);
  if (dryRun) {
    const d = await client.get(ref);
    const r = applyOps(d.content, ops, resolveLevel(d.content, level));
    return out({ dryRun: true, changes: r.changes, added: r.added }, ['Would make these changes (nothing saved):', ...r.changes.map((c) => `- ${c}`)].join('\n'));
  }
  const { meta, result, merged } = await client.edit(ref, (content) => {
    const r = applyOps(content, ops, resolveLevel(content, level));
    return { diagram: r.diagram, result: r };
  });
  out(
    { diagram: meta.id, version: meta.version, changes: result.changes, added: result.added, merged },
    [
      ...result.changes.map((c) => `✓ ${c}`),
      merged ? 'Someone else saved meanwhile; their changes were merged with these.' : '',
      `Saved ${meta.title} (version ${meta.version}).`,
    ]
      .filter(Boolean)
      .join('\n'),
  );
}

const listText = (list: DiagramMeta[]) =>
  list.length ? list.map((d) => `${d.id}  ${d.title}  (v${d.version}, updated ${new Date(d.updatedAt).toLocaleString()})`).join('\n') : 'No diagrams yet.';

async function main() {
  const [cmd, sub, ...rest] = args;
  if (!cmd || opt.help || cmd === 'help') return console.log(HELP);

  switch (cmd) {
    case 'guide':
      return console.log(GUIDE);

    case 'login': {
      const token = opt.token ?? (await browserLogin(config.server, (s) => console.error(s), !opt['no-browser']));
      const me = await new Client(config.server, token).me();
      saveConfig({ server: config.server, token });
      return out(
        { user: me.user, workspace: me.token?.orgName, scope: me.token?.scope },
        `Signed in as ${me.user.email} in ${me.token?.orgName} (${me.token?.scope === 'write' ? 'read and write' : 'read only'}).\nSaved to ${configPath()}.`,
      );
    }

    case 'logout': {
      if (config.token) await client.revokeSelf().catch(() => undefined);
      clearConfig();
      return out({ ok: true }, 'Signed out; the token is revoked.');
    }

    case 'whoami': {
      const me = await client.me();
      return out(
        me,
        `${me.user.email} in ${me.token?.orgName ?? me.orgs[0]?.name} · ${me.token?.scope === 'write' ? 'read and write' : 'read only'} · ${config.server}`,
      );
    }

    case 'diagrams': {
      if (sub === 'list' || !sub) {
        const list = await client.diagrams();
        return out(list, listText(list));
      }
      if (sub === 'create') {
        const content = opt.file ? parseDiagram(readJson(await readInput(opt.file), opt.file)) : undefined;
        const d = await client.create(opt.title ?? 'Untitled diagram', content);
        return out({ id: d.id, title: d.title, version: d.version }, `Created ${d.title} (${d.id}).`);
      }
      if (sub === 'get') {
        const d = await client.get(need(rest[0], 'a diagram'));
        return out(d);
      }
      if (sub === 'rename') {
        const m = await client.rename(need(rest[0], 'a diagram'), need(rest[1], 'the new title'));
        return out(m, `Renamed to ${m.title}.`);
      }
      if (sub === 'delete') {
        const ref = need(rest[0], 'a diagram');
        if (!opt.yes) throw new CliError(`Deleting removes "${ref}" for everyone in the workspace. Add --yes to confirm.`);
        await client.remove(ref);
        return out({ ok: true }, 'Deleted.');
      }
      break;
    }

    case 'describe': {
      const d = await client.get(need(sub, 'a diagram'));
      const level = resolveLevel(d.content, parseLevel(opt.level));
      const o = outline(d.content, { title: d.title, version: d.version }, level);
      return out(o, describeText(o));
    }

    case 'docs': {
      const ref = need(rest[0], 'a diagram');
      if (sub === 'get') {
        const d = await client.get(ref);
        const level = resolveLevel(d.content, parseLevel(opt.level));
        const at = levelAt(d.content, level)!;
        let md: string;
        if (opt.item) {
          const edge = at.edges.find((e) => e.id === opt.item);
          md = edge ? (edge.doc ?? '') : (findNode(at, opt.item).doc ?? '');
        } else if (level.length) {
          // A detail diagram's overview is its component's doc.
          md = levelAt(d.content, level.slice(0, -1))!.nodes.find((n) => n.id === level[level.length - 1])?.doc ?? '';
        } else md = d.content.doc ?? '';
        return out({ item: opt.item ?? null, level, markdown: md }, md || '(no doc yet)');
      }
      if (sub === 'set') {
        const markdown = await readInput(opt.file);
        return change(ref, [{ op: 'setDoc', ...(opt.item ? { item: opt.item } : {}), markdown }]);
      }
      break;
    }

    case 'nodes': {
      const ref = need(rest[0], 'a diagram');
      if (sub === 'add') {
        return change(ref, [
          {
            op: 'addNode',
            label: need(opt.label, '--label'),
            ...(opt.kind ? { kind: opt.kind as never } : {}),
            ...(opt.icon ? { icon: opt.icon } : {}),
            ...(opt.color ? { color: opt.color } : {}),
            ...(opt.in ? { in: opt.in } : {}),
            ...(opt.near ? { near: opt.near } : {}),
            ...(opt['doc-file'] ? { doc: readFileSync(opt['doc-file'], 'utf8') } : {}),
          },
        ]);
      }
      if (sub === 'update') {
        return change(ref, [
          {
            op: 'updateNode',
            item: need(rest[1], 'an item'),
            ...(opt.label !== undefined ? { label: opt.label } : {}),
            ...(opt.color ? { color: opt.color } : {}),
            ...(opt.kind ? { kind: opt.kind as never } : {}),
            ...(opt.icon ? { icon: opt.icon } : {}),
          },
        ]);
      }
      if (sub === 'remove') return change(ref, [{ op: 'removeNode', item: need(rest[1], 'an item') }]);
      break;
    }

    case 'edges': {
      const ref = need(rest[0], 'a diagram');
      const from = need(rest[1], 'the "from" item');
      const to = need(rest[2], 'the "to" item');
      const style = opt.style as 'solid' | 'dashed' | 'dotted' | undefined;
      if (style && !['solid', 'dashed', 'dotted'].includes(style)) throw new CliError('--style is solid, dashed or dotted.');
      if (sub === 'add') return change(ref, [{ op: 'addEdge', from, to, ...(opt.label ? { label: opt.label } : {}), ...(style ? { style } : {}) }]);
      if (sub === 'update') return change(ref, [{ op: 'updateEdge', from, to, ...(opt.label !== undefined ? { label: opt.label } : {}), ...(style ? { style } : {}) }]);
      if (sub === 'remove') return change(ref, [{ op: 'removeEdge', from, to }]);
      break;
    }

    case 'apply': {
      const ops = readJson(await readInput(opt.file), opt.file ?? 'stdin');
      if (!Array.isArray(ops)) throw new CliError('apply takes a JSON array of changes. See `isodraw guide`.');
      return change(need(sub, 'a diagram'), ops as Op[], opt['dry-run']);
    }

    case 'layout': {
      const level = parseLevel(opt.level);
      const { meta, result } = await client.edit(need(sub, 'a diagram'), (content) => {
        const at = resolveLevel(content, level);
        const before = levelAt(content, at)!;
        return { diagram: withLevel(content, at, layoutLevel), result: before.nodes.filter((n) => n.kind !== 'text').length };
      });
      return out({ diagram: meta.id, version: meta.version, items: result }, `Laid out ${result} items. Saved ${meta.title} (version ${meta.version}).`);
    }

    case 'import': {
      if (sub !== 'terraform') break;
      const file = need(rest[0], 'a Terraform state or plan JSON file');
      const json = readJson(readFileSync(file, 'utf8'), file);
      if (!isTerraformJson(json)) throw new CliError(`${file} doesn't look like Terraform state, \`terraform show -json\` output, or a plan.`);
      const { diagram, summary } = await importTerraform(json);
      const d = await client.create(opt.title ?? file.replace(/^.*\//, '').replace(/\.json$|\.tfstate$/g, ''), diagram);
      return out(
        { id: d.id, title: d.title, summary },
        `Created ${d.title} (${d.id}): ${summary.components} components and ${summary.connections} connections from ${summary.resources} resources.`,
      );
    }

    case 'export': {
      const d = await client.get(need(sub, 'a diagram'));
      const format = opt.format ?? 'json';
      if (format === 'md') return console.log(exportDocsMarkdown(d.content, d.title));
      if (format === 'json') return console.log(JSON.stringify(d.content, null, 2));
      throw new CliError('--format is json or md.');
    }

    case 'icons': {
      const q = (sub ?? '').toLowerCase();
      const list = iconTypes().filter((i) => !q || i.type.includes(q) || i.what.toLowerCase().includes(q));
      return out(list, list.length ? list.map((i) => `${i.type.padEnd(48)} ${i.what}`).join('\n') : `No icons match "${q}".`);
    }
  }
  throw new CliError(`Unknown command: ${args.join(' ')}. Run \`isodraw --help\`.`);
}

main().catch((e: unknown) => {
  const err = e instanceof OpError ? new CliError(e.message, e.code === 'invalid' ? 1 : 2) : e;
  if (err instanceof CliError) {
    if (opt.json) console.log(JSON.stringify({ error: err.message, exitCode: err.exitCode }));
    else console.error(`isodraw: ${err.message}`);
    process.exit(err.exitCode);
  }
  console.error(e);
  process.exit(1);
});
