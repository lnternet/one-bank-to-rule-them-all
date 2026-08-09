import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  base: './',
  define: {
    __API_BASE_URL__: JSON.stringify(process.env.VITE_API_BASE_URL ?? ''),
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
});
