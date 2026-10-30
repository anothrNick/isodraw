import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'node:path';

// Library build (npm run build)
export default defineConfig({
  plugins: [react(), dts({ include: ['src/lib'], exclude: ['src/**/*.test.ts'], rollupTypes: true })],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib/index.ts'),
      fileName: 'isodraw',
      // ES + CJS (not UMD) so the Tiptap docs editor can stay a lazy-loaded chunk.
      formats: ['es', 'cjs'],
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: [/^react(-dom)?($|\/)/, /^@tiptap\//, 'tiptap-markdown'],
      output: {
        assetFileNames: 'isodraw.[ext]',
      },
    },
  },
});
