import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { createServer } from 'node:http';
import { hostname } from 'node:os';
import { CliError } from './client';

/**
 * Sign in through the browser: listen on a local port, open the app's
 * authorize page, and wait for it to send the browser back with a token.
 */
export async function browserLogin(server: string, log: (s: string) => void, open = true): Promise<string> {
  const state = randomBytes(18).toString('base64url');
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      srv.close();
      reject(new CliError('Timed out waiting for the browser. Run `isodraw login` again.'));
    }, 5 * 60_000);

    const srv = createServer((req, res) => {
      const url = new URL(req.url ?? '/', 'http://127.0.0.1');
      if (url.pathname !== '/callback') {
        res.writeHead(404).end();
        return;
      }
      const token = url.searchParams.get('token') ?? '';
      if (url.searchParams.get('state') !== state || !token.startsWith('isd_')) {
        res.writeHead(400, { 'Content-Type': 'text/html' }).end(page('Sign-in failed', 'This link didn’t come from the sign-in you started. Run <code>isodraw login</code> again.'));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' }).end(page('The CLI is signed in', 'You can close this tab and go back to your terminal.'));
      clearTimeout(timer);
      srv.close();
      resolve(token);
    });

    srv.listen(0, '127.0.0.1', () => {
      const port = (srv.address() as { port: number }).port;
      const url = `${server}/cli/login?port=${port}&state=${state}&name=${encodeURIComponent(hostname())}`;
      if (open) {
        log(`Opening your browser to sign in. If it doesn't open, visit:\n  ${url}\n`);
        openBrowser(url);
      } else log(`To sign in, open this in a browser where you're signed in to IsoDraw:\n  ${url}\n`);
    });
  });
}

function openBrowser(url: string) {
  const [cmd, args] =
    process.platform === 'darwin' ? ['open', [url]] : process.platform === 'win32' ? ['cmd', ['/c', 'start', '', url]] : ['xdg-open', [url]];
  try {
    spawn(cmd, args, { stdio: 'ignore', detached: true }).on('error', () => undefined).unref();
  } catch {
    /* the URL is printed */
  }
}

const page = (title: string, body: string) =>
  `<!doctype html><meta charset="utf-8"><title>${title}</title><body style="font:15px system-ui;display:grid;place-items:center;height:90vh;color:#0f172a"><div style="text-align:center"><h1 style="font-size:20px">${title}</h1><p>${body}</p></div>`;
