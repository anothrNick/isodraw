import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Demo site config (npm run dev / npm run build:demo)
export default defineConfig({
  plugins: [react()],
  // Relative asset paths so the demo works under /isodraw/ on GitHub Pages.
  base: './',
  server: { port: 5173, open: false },
  build: { outDir: 'demo-dist' },
});
