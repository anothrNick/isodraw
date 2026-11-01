import { liftEmbeds, mergeDiagrams, parseDiagram, type Diagram } from './lib';

/** What the CLI shows when something fails, and the exit code it uses. */
export class CliError extends Error {
  constructor(
    message: string,
    /** 1 usage or other · 2 not found · 3 conflict · 4 not signed in or not allowed */
    readonly exitCode = 1,
  ) {
    super(message);
  }
}

export interface Org {
  id: string;
  name: string;
  slug: string;
  personal: boolean;
  role: string;
}

export interface Me {
  user: { id: string; email: string; name: string };
  orgs: Org[];
  token?: { id: string; name: string; scope: 'read' | 'write'; orgId: string; orgName: string; expiresAt: string | null };
}

export interface DiagramMeta {
  id: string;
  orgId: string;
  title: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface StoredDiagram extends DiagramMeta {
  content: Diagram;
}

export interface PreviewLinks {
  svg: string;
  png: string;
  url: string;
  title: string;
  expiresAt: string;
}

export class Client {
  constructor(
    readonly server: string,
    private readonly token?: string,
  ) {}

  async request<T>(method: string, path: string, body?: unknown, headers: Record<string, string> = {}): Promise<T> {
    if (!this.token) throw new CliError('Not signed in. Run `isodraw login`, or set ISODRAW_TOKEN.', 4);
    let res: Response;
    try {
      res = await fetch(this.server + path, {
        method,
        headers: { Authorization: `Bearer ${this.token}`, ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...headers },
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    } catch (e) {
      throw new CliError(`Can't reach ${this.server} (${(e as Error).message}). Is the server running? Set it with --server or ISODRAW_SERVER.`);
    }
    if (res.status === 204) return undefined as T;
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (!res.ok) {
      const err = (data.error ?? {}) as { code?: string; message?: string };
      const code = res.status === 404 ? 2 : res.status === 409 ? 3 : res.status === 401 || res.status === 403 ? 4 : 1;
      const e = new CliError(err.message ?? `Request failed (${res.status})`, code);
      Object.assign(e, { status: res.status, body: data });
      throw e;
    }
    return data as T;
  }

  me = () => this.request<Me>('GET', '/api/me');

  /** The token's workspace: every command works in it. */
  async org(): Promise<Org> {
    const me = await this.me();
    const org = me.token ? me.orgs.find((o) => o.id === me.token!.orgId) : me.orgs[0];
    if (!org) throw new CliError("This token's workspace is gone, or you're no longer in it. Run `isodraw login` again.", 4);
    return org;
  }

  async diagrams(): Promise<DiagramMeta[]> {
    const org = await this.org();
    return (await this.request<{ diagrams: DiagramMeta[] }>('GET', `/api/orgs/${org.id}/diagrams`)).diagrams;
  }

  /** A diagram by id or title (exact, or a unique start of one; case doesn't matter). */
  async resolve(ref: string): Promise<DiagramMeta> {
    const list = await this.diagrams();
    const r = ref.trim().toLowerCase();
    const exact = list.filter((d) => d.id === ref || d.title.toLowerCase() === r);
    const found = exact.length ? exact : list.filter((d) => d.title.toLowerCase().startsWith(r));
    if (found.length === 1) return found[0];
    if (found.length > 1) throw new CliError(`"${ref}" matches ${found.length} diagrams: ${found.map((d) => `${d.id} (${d.title})`).join(', ')}. Use an id.`, 2);
    throw new CliError(`No diagram "${ref}". Run \`isodraw diagrams list\` to see them.`, 2);
  }

  async get(ref: string): Promise<StoredDiagram> {
    const meta = await this.resolve(ref);
    const d = await this.request<StoredDiagram>('GET', `/api/diagrams/${meta.id}`);
    return { ...d, content: liftEmbeds(parseDiagram(d.content)) };
  }

  create = async (title: string, content?: Diagram) => {
    const org = await this.org();
    return this.request<StoredDiagram>('POST', `/api/orgs/${org.id}/diagrams`, { title, content });
  };

  /**
   * Change a diagram's content. If someone saved in between, merge their
   * version with this edit item by item (as the app does) and try again, so
   * nobody's work is overwritten.
   */
  async edit<T>(ref: string, change: (d: Diagram) => { diagram: Diagram; result: T }): Promise<{ meta: DiagramMeta; result: T; merged: boolean }> {
    const start = await this.get(ref);
    let base = start.content;
    let version = start.version;
    let { diagram: mine, result } = change(base);
    let merged = false;
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const meta = await this.request<DiagramMeta>('PUT', `/api/diagrams/${start.id}/content`, mine, { 'If-Match': `"${version}"` });
        return { meta, result, merged };
      } catch (e) {
        const status = (e as { status?: number }).status;
        if (status !== 409) throw e;
        const current = (e as { body: { current: StoredDiagram } }).body.current;
        const theirs = parseDiagram(current.content);
        mine = mergeDiagrams(base, mine, theirs).diagram;
        base = theirs;
        version = current.version;
        merged = true;
      }
    }
    throw new CliError('The diagram kept changing while saving. Try again.', 3);
  }

  /** Signed picture links for a diagram (or one level): SVG, PNG, and the editor link. */
  async preview(id: string, level: string[] = [], ttl?: string): Promise<PreviewLinks> {
    const q = new URLSearchParams();
    if (level.length) q.set('level', level.join('/'));
    if (ttl) q.set('ttl', ttl);
    const p = await this.request<Omit<PreviewLinks, 'png'> & { png?: string }>('GET', `/api/diagrams/${id}/preview?${q}`);
    // Older APIs only answer with the SVG link; the PNG is the same link with another extension.
    return { ...p, png: p.png ?? p.svg.replace('.svg?', '.png?') };
  }

  rename = async (ref: string, title: string) => this.request<DiagramMeta>('PATCH', `/api/diagrams/${(await this.resolve(ref)).id}`, { title });
  remove = async (ref: string) => this.request<void>('DELETE', `/api/diagrams/${(await this.resolve(ref)).id}`);
  revokeSelf = () => this.request<void>('DELETE', '/api/tokens/current');
}
