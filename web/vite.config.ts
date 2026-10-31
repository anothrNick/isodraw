import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

// The platform app. In development the API runs on :8080 and this server
// proxies /api and /auth to it, so the app and API share one origin and the
// session cookie needs no CORS. The library is used from source, so edits to
// it hot-reload here too.
const API = process.env.ISODRAW_API ?? 'http://localhost:8080';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { isodraw: fileURLToPath(new URL('../packages/isodraw/src/lib/index.ts', import.meta.url)) },
  },
  server: {
    port: 5190,
    strictPort: true,
    proxy: { '/api': API, '/auth': API },
  },
  build: { outDir: 'dist' },
});
