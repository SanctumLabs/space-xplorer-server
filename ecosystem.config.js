module.exports = {
  apps: [
    {
      name: 'SpaceXplorerApi',
      script: 'server.js',
      watch: true,
      env: {
        NODE_ENV: 'production',
      },
      instances: 'max',
      exec_mode: 'cluster',
      out_file: '/dev/null',
      error_file: '/dev/null',
      output: '/dev/stdout',
      error: '/dev/stderr',
      exp_backoff_restart_delay: 100,
      time: true,
    },
    {
      name: 'SpaceXplorerApi-Dev',
      script: 'build/server.js',
      watch: true,
      env: {
        NODE_ENV: 'development',
      },
      instances: 'max',
      exec_mode: 'cluster',
      out_file: '/dev/null',
      error_file: '/dev/null',
      output: '/dev/stdout',
      error: '/dev/stderr',
      exp_backoff_restart_delay: 100,
      time: true,
    },
  ],
};
