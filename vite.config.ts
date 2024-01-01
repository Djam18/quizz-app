import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  server: {
    port: 5173,
    host: true,
    strictPort: true,
    // Configuration pour le hot-reloading
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
    },
  },
  // Configurer les en-têtes CSP pour résoudre les problèmes de sécurité
  preview: {
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' ws:; style-src 'self' 'unsafe-inline'; img-src 'self' data:;",
    },
  },
  // Compatibilité pour les anciennes versions de Node
  build: {
    target: 'es2015',
  },
})