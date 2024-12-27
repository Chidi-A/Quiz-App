import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',  // Use '/' for deploying at root domain
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  publicDir: 'public'  // This will handle your public assets
})

