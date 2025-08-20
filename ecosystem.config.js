module.exports = {
  apps: [
    {
      name: 'sermixer-api',
      cwd: '/var/www/server-v2.0',
      script: 'yarn',
      args: 'start',
      interpreter: 'none',
      env: { NODE_ENV: 'production' },
      env_file: '/var/www/server-v2.0/.env.remote',

      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: '/var/log/pm2/sermixer-api.err.log',
      out_file: '/var/log/pm2/sermixer-api.out.log'
    }
  ]
}
