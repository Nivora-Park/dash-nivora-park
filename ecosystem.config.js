module.exports = {
  apps: [
    {
      name: 'dash-nivora-park',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      env: {
        PORT: 3005,
        NODE_ENV: 'production'
      },
  pre_start: 'npm run build',
  post_restart: 'npm run build'
    }
  ]
};
