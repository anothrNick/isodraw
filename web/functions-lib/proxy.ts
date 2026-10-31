/**
 * Cloudflare Pages Functions forward /api/* and /auth/* to the API on Fly, so
 * the browser only ever talks to this site: one origin, no CORS, and the
 * session cookie belongs to the site's own domain.
 *
 * API_ORIGIN is set on the Pages project (for example https://isodraw-api.fly.dev).
 */
export interface Env {
  API_ORIGIN: string;
}

/** The parts of Pages' function context these handlers use. */
export interface Context {
  request: Request;
  env: Env;
}

export async function proxy({ request, env }: Context): Promise<Response> {
  if (!env.API_ORIGIN) return new Response('API_ORIGIN is not set on this Pages project.', { status: 500 });
  const url = new URL(request.url);
  const target = new URL(url.pathname + url.search, env.API_ORIGIN);
  const headers = new Headers(request.headers);
  // The API checks Origin against its PUBLIC_URL (this site), so Origin passes through untouched.
  headers.set('X-Forwarded-Host', url.host);
  headers.set('X-Forwarded-Proto', url.protocol.replace(':', ''));
  const res = await fetch(target, {
    method: request.method,
    headers,
    body: request.method === 'GET' || request.method === 'HEAD' ? undefined : request.body,
    // Sign-in answers with redirects to the identity provider and back; the browser follows them, not this function.
    redirect: 'manual',
  });
  // Pass everything back as is, Set-Cookie and Location included.
  return new Response(res.body, res);
}
