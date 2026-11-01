import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

// The platform app. In development the API runs on :8080 and this server
// proxies /api, /auth, /oauth and the OAuth discovery documents to it, so the app and API share one origin and the
// session cookie needs no CORS. The library is used from source, so edits to
// it hot-reload here too.
const API = process.env.ISODRAW_API ?? 'http://localhost:8080';

// In production a Pages Function draws preview links' pictures (/p/{id}.svg);
// here the dev server does, with the same code.
function previews(): Plugin {
  return {
    name: 'isodraw-previews',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.method !== 'GET' || !req.url?.startsWith('/p/')) return next();
        try {
          const { previewSvg, previewHeaders } = await server.ssrLoadModule('/preview/render.ts');
          const url = new URL(req.url, `http://${req.headers.host}`);
          const out = await previewSvg(url, API);
          res.writeHead(out.status, previewHeaders(out.cacheable));
          res.end(out.svg);
        } catch (e) {
          next(e);
        }
      });
    },
  };
}

// In production a Pages Function serves the MCP endpoint (/mcp) for AI apps;
// here the dev server does, with the same handler from the CLI package.
const MCP_HANDLER = fileURLToPath(new URL('../packages/cli/src/mcpHttp.ts', import.meta.url));

function mcp(): Plugin {
  return {
    name: 'isodraw-mcp',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url !== '/mcp' && !req.url?.startsWith('/mcp?')) return next();
        try {
          const { handleMcp } = await server.ssrLoadModule(MCP_HANDLER);
          const chunks: Buffer[] = [];
          for await (const c of req) chunks.push(c as Buffer);
          const headers = new Headers();
          for (const [k, v] of Object.entries(req.headers)) if (typeof v === 'string') headers.set(k, v);
          const request = new Request(new URL(req.url, `http://${req.headers.host}`), {
            method: req.method,
            headers,
            body: req.method === 'GET' || req.method === 'HEAD' || !chunks.length ? undefined : Buffer.concat(chunks),
          });
          const out: Response = await handleMcp(request, { apiOrigin: API });
          res.writeHead(out.status, Object.fromEntries(out.headers));
          res.end(Buffer.from(await out.arrayBuffer()));
        } catch (e) {
          next(e);
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), previews(), mcp()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      isodraw: fileURLToPath(new URL('../packages/isodraw/src/lib/index.ts', import.meta.url)),
      // The demo's documented examples double as templates for new diagrams.
      'isodraw-templates': fileURLToPath(new URL('../packages/isodraw/src/demo/examples.ts', import.meta.url)),
    },
  },
  server: {
    port: 5190,
    strictPort: true,
    proxy: { '/api': API, '/auth': API, '/oauth': API, '/.well-known/oauth-': API },
  },
  build: { outDir: 'dist' },
});
