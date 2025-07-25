// EasyPanel-specific Vite configuration
// This file is used specifically for EasyPanel deployments

export default {
  server: {
    host: '0.0.0.0',
    port: 80,
    cors: true
  },
  preview: {
    host: '0.0.0.0',
    port: 80,
    cors: true,
    allowedHosts: 'all' // Allow all hosts in preview mode
  }
};
