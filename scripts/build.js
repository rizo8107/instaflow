// Custom build script to ensure EasyPanel host is allowed
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Create a custom vite.config.js file for production
const viteConfigPath = path.join(rootDir, 'vite.config.js');

// Define the production configuration with allowedHosts
const prodConfig = `
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
    allowedHosts: [
      'konipai-instaflow.7za6uc.easypanel.host',
      '*.easypanel.host',
      'all'
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
`;

// Write the production config file
try {
  fs.writeFileSync(viteConfigPath, prodConfig);
  console.log('Created production Vite config with allowedHosts');
} catch (err) {
  console.error('Failed to create production Vite config:', err);
  process.exit(1);
}

// Run the build command with the EasyPanel-specific configuration
try {
  console.log('Building frontend with EasyPanel-specific configuration...');
  execSync('vite build --config vite.config.easypanel.js', { stdio: 'inherit', cwd: rootDir });
  console.log('Build completed successfully');
  
  // Copy the EasyPanel config to the dist folder for preview mode
  const distConfigPath = path.join(rootDir, 'dist', 'vite.config.js');
  fs.copyFileSync(path.join(rootDir, 'vite.config.easypanel.js'), distConfigPath);
  console.log('Copied EasyPanel configuration to dist folder');
} catch (err) {
  console.error('Build failed:', err);
  process.exit(1);
}
