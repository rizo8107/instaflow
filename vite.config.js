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
    allowedHosts: [
      'konipai-instaflow.7za6uc.easypanel.host',
      '*.easypanel.host'
    ]
  }
};
