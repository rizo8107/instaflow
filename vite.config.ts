import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  preview: {
    host: '0.0.0.0',
    port: 80,
    cors: true,
    // @ts-expect-error - allowedHosts is supported in Vite but not in the TypeScript definitions
    allowedHosts: [
      'konipai-instaflow.7za6uc.easypanel.host',
      '*.easypanel.host'
    ]
  },
  server: {
    host: '0.0.0.0',
    port: 80,
    cors: true,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
