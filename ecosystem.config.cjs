/**
 * PM2 Ecosystem Configuration
 * SkillCraft-Interlingua
 */

module.exports = {
  apps: [
    {
      name: 'skillcraft-interlingua',
      script: 'dist/index.cjs',
      cwd: '/var/www/SkillCraft-Interlingua',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      
      env_production: {
        NODE_ENV: 'production',
        PORT: 5005,
      },
      
      env_development: {
        NODE_ENV: 'development',
        PORT: 5005,
      },

      error_file: '/var/log/pm2/skillcraft-interlingua-error.log',
      out_file: '/var/log/pm2/skillcraft-interlingua-out.log',
      log_file: '/var/log/pm2/skillcraft-interlingua-combined.log',
      time: true,
      
      restart_delay: 4000,
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
      exp_backoff_restart_delay: 100,
      max_restarts: 10,
    }
  ],

  deploy: {
    production: {
      user: 'root',
      host: '72.62.36.128',
      ref: 'origin/main',
      repo: 'git@github.com:InterlinguaFormazione/SkillCraft-Interlingua.git',
      path: '/var/www/SkillCraft-Interlingua',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.cjs --env production',
    }
  }
};
