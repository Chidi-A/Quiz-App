import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',  // Use '/' for deploying at root domain
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
  },
  publicDir: 'public'  // This will handle your public assets
})

