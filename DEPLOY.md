# Deployment Guide - English Workout

Deploy the SkillCraft-Interlingua website to your VPS.

## Prerequisites

- Ubuntu 22.04+ or Debian 11+ VPS
- Root or sudo access
- Domain pointing to your VPS IP (english-workout.interlingua.it)

## Quick Start

### 1. Server Setup

```bash
# Upload and run setup script
sudo ./scripts/setup-server.sh
```

This installs:
- Node.js 20.x
- PM2 (process manager)
- Nginx (web server)
- PostgreSQL (database)
- Certbot (SSL certificates)

### 2. Database Setup

```bash
sudo -u postgres psql
```

```sql
CREATE USER english_workout_user WITH PASSWORD 'YOUR_SECURE_PASSWORD';
CREATE DATABASE english_workout OWNER english_workout_user;
\q
```

### 3. Clone Repository

```bash
cd /var/www/english-workout
git clone YOUR_REPO_URL .
```

### 4. Environment Configuration

```bash
cp .env.example .env
nano .env
```

Fill in:
- `DATABASE_URL` with your PostgreSQL credentials
- `SESSION_SECRET` (generate with `openssl rand -base64 32`)

### 5. Nginx Configuration

```bash
sudo cp nginx/english-workout.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/english-workout.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. SSL Certificate

```bash
sudo certbot --nginx -d english-workout.interlingua.it
```

### 7. Build & Start

```bash
npm install
npm run build
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 startup
```

## Useful Commands

```bash
# View logs
pm2 logs english-workout

# Restart application
pm2 restart english-workout

# Stop application
pm2 stop english-workout

# Monitor
pm2 monit

# Check Nginx status
sudo systemctl status nginx

# Check Nginx logs
sudo tail -f /var/log/nginx/english-workout.error.log
```

## Updating the Application

```bash
cd /var/www/english-workout
git pull origin main
npm install
npm run build
pm2 restart english-workout
```

## Troubleshooting

### Application won't start
```bash
pm2 logs english-workout --lines 50
```

### Nginx errors
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

### Database connection issues
```bash
sudo -u postgres psql -c "SELECT 1;"
```

## File Structure

```
/var/www/english-workout/
├── dist/                 # Built application
│   ├── index.js         # Server entry point
│   └── public/          # Static assets
├── .env                 # Environment variables
├── ecosystem.config.cjs # PM2 configuration
└── package.json
```
