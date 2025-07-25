import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    cors: true,
  },
  preview: {
    allowedHosts: [
      'konipai-instaflow.7za6uc.easypanel.host',
      '*.easypanel.host', // Allow all easypanel subdomains
    ],
  },
});
