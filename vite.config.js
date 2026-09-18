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
    host: false,
    port: 3000,
    open: false,
    watch: {
      ignored: ['**/public/*.pdf', '**/catalog_images/**', '**/public/catalog_images/**'],
    },
  },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three')) {
              return 'vendor-three';
            }
            if (id.includes('gsap') || id.includes('@gsap')) {
              return 'vendor-gsap';
            }
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-lucide';
            }
            if (id.includes('jspdf') || id.includes('canvg') || id.includes('html2canvas')) {
              return 'vendor-pdf';
            }
            if (id.includes('react') || id.includes('react-dom') || id.includes('zustand')) {
              return 'vendor-react';
            }
          }
        },
      },
    },
  },
});
