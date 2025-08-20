module.exports = {
  apps: [
    {
      name: 'sermixer-api-v3.0',
      cwd: '/var/www/server-v3.0/app',
      script: 'yarn',
      args: 'start',
      interpreter: 'none',
      env: { NODE_ENV: 'development' },
      env_file: '/var/www/server-v3.0/app/.env.remote',

      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: '/var/log/pm2/sermixer-api-v3.0.err.log',
      out_file: '/var/log/pm2/sermixer-api-v3.0.out.log'
    },
    {
      name: 'sermixer-frontend-v3.0',
      cwd: '/var/www/v3.0/app',
      script: 'yarn',
      args: 'start',
      interpreter: 'none',
      env: { 
        NODE_ENV: 'development',
        PORT: 3000,
        BROWSER: 'none'
      },
      env_file: '/var/www/v3.0/app/.env.local',

      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: '/var/log/pm2/sermixer-frontend-v3.0.err.log',
      out_file: '/var/log/pm2/sermixer-frontend-v3.0.out.log'
    }
  ]
}
