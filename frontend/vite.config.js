import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';

const packageJson = JSON.parse(readFileSync(new URL('./package.json', import.meta.url)));

export default defineConfig({
  plugins: [react()],
  base: './',
  define: {
    __API_BASE_URL__: JSON.stringify(process.env.VITE_API_BASE_URL ?? ''),
    __APP_VERSION__: JSON.stringify(packageJson.version),
    __BUILD_TAG__: JSON.stringify(process.env.VITE_BUILD_TAG ?? 'local'),
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
});
