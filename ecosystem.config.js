module.exports = {
  apps: [
    {
      name: 'spaceXplorerApi',
      script: 'server.js',
      watch: true,
      env: {
        NODE_ENV: 'production',
      },
      instances: 'max',
      exec_mode: 'cluster',
    },
  ],
};
