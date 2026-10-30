import { defineConfig } from 'vitest/config';

// Unit tests (npm test). Browser tests live in e2e/ and run with Playwright.
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
