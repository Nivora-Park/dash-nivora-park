module.exports = {
  apps: [
    {
      name: 'dash-nivora-park',
      // Use npm start which will call 'next start' in production
      script: 'npm',
      args: 'start',
      env: {
        PORT: 80,
        NODE_ENV: 'production'
      },
      // Recommended PM2 options
      exec_mode: 'fork',
      instances: 1,
      watch: false
    }
  ]
};
