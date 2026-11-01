import { afterEach, describe, expect, it, vi } from 'vitest';
import { handleMcp } from './mcpHttp';

const API = 'https://api.test';

/** A stand-in API: /api/me answers per token; everything else is a 404. */
function api(valid: Record<string, boolean>) {
  return vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
    const token = new Headers(init?.headers).get('Authorization')?.replace('Bearer ', '') ?? '';
    if (String(url) === `${API}/api/me`) {
      return valid[token]
        ? Response.json({ user: { id: 'u', email: 'a@b.c', name: 'A' }, orgs: [{ id: 'o', name: 'Personal', slug: 'p', personal: true, role: 'owner' }], token: { orgId: 'o' } })
        : Response.json({ error: { message: 'no' } }, { status: 401 });
    }
    if (String(url) === `${API}/api/orgs/o/diagrams`) return Response.json({ diagrams: [] });
    return Response.json({ error: { message: 'not found' } }, { status: 404 });
  });
}

const rpc = (body: unknown, token?: string) =>
  new Request('https://isodraw.test/mcp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
  });

afterEach(() => vi.unstubAllGlobals());

describe('the hosted MCP endpoint', () => {
  it('answers CORS preflight', async () => {
    const res = await handleMcp(new Request('https://isodraw.test/mcp', { method: 'OPTIONS' }), { apiOrigin: API });
    expect(res.status).toBe(204);
    expect(res.headers.get('Access-Control-Allow-Headers')).toContain('Authorization');
  });

  it('asks apps without a token to sign in, pointing at the OAuth metadata', async () => {
    const res = await handleMcp(rpc({ jsonrpc: '2.0', id: 1, method: 'tools/list' }), { apiOrigin: API });
    expect(res.status).toBe(401);
    expect(res.headers.get('WWW-Authenticate')).toBe('Bearer resource_metadata="https://isodraw.test/.well-known/oauth-protected-resource/mcp"');
    expect(res.headers.get('Access-Control-Expose-Headers')).toContain('WWW-Authenticate');
  });

  it('turns away tokens the API rejects', async () => {
    const res = await handleMcp(rpc({ jsonrpc: '2.0', id: 1, method: 'tools/list' }, 'isd_bad'), { apiOrigin: API, fetch: api({}) });
    expect(res.status).toBe(401);
    expect(res.headers.get('WWW-Authenticate')).toContain('error="invalid_token"');
  });

  it('serves the tools with a good token, calling the API with it', async () => {
    const fake = api({ isd_good: true });
    vi.stubGlobal('fetch', fake);
    const list = await handleMcp(rpc({ jsonrpc: '2.0', id: 1, method: 'tools/list' }, 'isd_good'), { apiOrigin: API, fetch: fake });
    expect(list.status).toBe(200);
    const tools = ((await list.json()) as { result: { tools: { name: string }[] } }).result.tools.map((t) => t.name);
    expect(tools).toContain('apply_changes');

    const call = await handleMcp(rpc({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'list_diagrams', arguments: {} } }, 'isd_good'), {
      apiOrigin: API,
      fetch: fake,
    });
    const out = (await call.json()) as { result: { content: { text: string }[] } };
    expect(out.result.content[0].text).toMatch(/No diagrams yet/);
    expect(fake.mock.calls.some(([u, init]) => String(u) === `${API}/api/orgs/o/diagrams` && new Headers(init?.headers).get('Authorization') === 'Bearer isd_good')).toBe(true);
  });
});
