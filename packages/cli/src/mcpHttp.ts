/**
 * The hosted MCP endpoint (`/mcp`), for AI apps that connect over the web:
 * Claude's connectors, ChatGPT, and anything else speaking Streamable HTTP.
 * It runs in a Cloudflare Pages Function (and the Vite dev server locally),
 * so it uses only web-standard APIs.
 *
 * Each request stands alone: the bearer token is an IsoDraw API token, which
 * apps get through OAuth (the API's /oauth endpoints). Tools call the API with
 * it, exactly as the CLI does.
 */
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { CfWorkerJsonSchemaValidator } from '@modelcontextprotocol/sdk/validation/cfworker-provider.js';
import { Client } from './client';
import { createMcpServer } from './mcp';

const CORS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type, Accept, Mcp-Session-Id, MCP-Protocol-Version, Last-Event-ID',
  'Access-Control-Expose-Headers': 'WWW-Authenticate, Mcp-Session-Id, MCP-Protocol-Version',
  'Access-Control-Max-Age': '86400',
};

/** Tokens the API recently accepted, so a burst of tool calls checks once. Per isolate; short-lived. */
const recent = new Map<string, number>();
const CHECK_FOR = 60_000;

async function digest(token: string): Promise<string> {
  const h = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return btoa(String.fromCharCode(...new Uint8Array(h)));
}

/** Does the API accept this token? */
async function accepted(apiOrigin: string, token: string, get: typeof fetch): Promise<boolean> {
  const key = await digest(token);
  if ((recent.get(key) ?? 0) > Date.now()) return true;
  const res = await get(`${apiOrigin}/api/me`, { headers: { Authorization: `Bearer ${token}` } });
  if (res.status === 401 || res.status === 403) return false;
  if (!res.ok) throw new Error(`The API answered ${res.status}`);
  if (recent.size > 5000) recent.clear();
  recent.set(key, Date.now() + CHECK_FOR);
  return true;
}

function withCors(res: Response): Response {
  const headers = new Headers(res.headers);
  for (const [k, v] of Object.entries(CORS)) headers.set(k, v);
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}

/** 401 with where to sign in, so the app starts OAuth (MCP authorization, RFC 9728). */
function signInFirst(origin: string, error?: string): Response {
  const meta = `${origin}/.well-known/oauth-protected-resource/mcp`;
  return withCors(
    new Response(JSON.stringify({ error: error ?? 'unauthorized', error_description: 'Connect IsoDraw: sign in to allow access.' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        'WWW-Authenticate': `Bearer resource_metadata="${meta}"${error ? `, error="${error}"` : ''}`,
      },
    }),
  );
}

/** Answer one request to /mcp. `apiOrigin` is where the API is (on Fly in production). */
export async function handleMcp(request: Request, opts: { apiOrigin: string; fetch?: typeof fetch }): Promise<Response> {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  const origin = new URL(request.url).origin;
  const token = /^Bearer\s+(\S+)$/i.exec(request.headers.get('Authorization') ?? '')?.[1];
  if (!token) return signInFirst(origin);
  try {
    if (!(await accepted(opts.apiOrigin, token, opts.fetch ?? fetch))) return signInFirst(origin, 'invalid_token');
  } catch {
    return withCors(new Response(JSON.stringify({ error: 'temporarily_unavailable' }), { status: 503, headers: { 'Content-Type': 'application/json' } }));
  }
  const server = createMcpServer(new Client(opts.apiOrigin, token), { jsonSchemaValidator: new CfWorkerJsonSchemaValidator() });
  // Stateless: no sessions to keep between requests, and plain JSON answers.
  const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
  await server.connect(transport);
  return withCors(await transport.handleRequest(request));
}
