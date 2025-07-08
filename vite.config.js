// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,                    // escucha en 0.0.0.0 para conexiones externas
    allowedHosts: ['.tunnelmole.net'], // acepta TODOS los subdominios *.tunnelmole.net
  },
});
