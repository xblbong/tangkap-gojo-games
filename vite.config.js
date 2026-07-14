import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    include: ['phaser'],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  server: {
    port: 5173,
  },
});
