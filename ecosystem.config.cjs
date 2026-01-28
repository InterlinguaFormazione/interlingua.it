/**
 * PM2 Ecosystem Configuration
 * English Workout - SkillCraft Interlingua
 */

module.exports = {
  apps: [
    {
      name: 'english-workout',
      script: 'dist/index.js',
      cwd: '/var/www/english-workout',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      
      // Environment variables for production
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      
      // Environment variables for development
      env_development: {
        NODE_ENV: 'development',
        PORT: 5000,
      },

      // Logging
      error_file: '/var/log/pm2/english-workout-error.log',
      out_file: '/var/log/pm2/english-workout-out.log',
      log_file: '/var/log/pm2/english-workout-combined.log',
      time: true,
      
      // Restart delay
      restart_delay: 4000,
      
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,

      // Health monitoring
      exp_backoff_restart_delay: 100,
      max_restarts: 10,
    }
  ],

  // Deployment configuration (optional - for pm2 deploy)
  deploy: {
    production: {
      user: 'deploy',
      host: 'your-vps-ip',
      ref: 'origin/main',
      repo: 'git@github.com:your-username/english-workout.git',
      path: '/var/www/english-workout',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.cjs --env production',
      'pre-setup': '',
    }
  }
};
