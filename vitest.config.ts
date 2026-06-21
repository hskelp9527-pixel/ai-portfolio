import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.deploy-staging/**',
      '**/.tmp/**',
      '**/_trash/**',
      '**/重构前端ai/**',
    ],
  },
  resolve: {
    alias: {
      '@': '.',
    },
  },
});
