---
name: vps-deployment
description: Deploy Node.js applications to the user's VPS server. Use when the user asks to deploy, publish to VPS, set up a new app on their server, or troubleshoot VPS deployment issues.
---

# VPS Deployment

Deploy and manage Node.js applications on the user's dedicated VPS.

## Server Details

- **Hostname**: `srv1133915`
- **Access**: Root SSH
- **OS**: Ubuntu (apt-based)
- **Node.js**: v20.20.0 (global via system)
- **Process Manager**: PM2 (global)
- **Web Server**: Nginx reverse proxy + Certbot SSL
- **Database**: PostgreSQL on `localhost:5432`
- **App Directory Pattern**: `/var/www/<app-name>`

## Existing Apps on VPS

| PM2 Name | Port | Directory |
|----------|------|-----------|
| interlingua | 5004 | /var/www/interlingua |
| skillcraft-interlingua | (check) | /var/www/SkillCraft-Interlingua |
| skillcraft | (check) | /var/www/skillcraft |
| skillcraft-crm | (check) | /var/www/skillcraft-crm |
| english-test | (check) | /var/www/english-test |
| english-workout | (check) | /var/www/english-workout |
| quality-skillcraft | (check) | /var/www/quality-skillcraft |

To check ports and statuses: `pm2 list`

## Critical Lessons Learned

### 1. PM2 environment variables override .env files
The `DATABASE_URL` and other env vars are set in PM2's environment, NOT read from `.env` files. Always check the actual PM2 env:
```bash
pm2 env <process_id> | grep DATABASE
```

### 2. Dev dependencies are required for builds
The build step uses `esbuild` which is a dev dependency. Always install with:
```bash
npm install --include=dev
```
On this VPS, `npm install` alone may skip devDependencies depending on `NODE_ENV`. Always use `--include=dev` to be safe.

### 3. Database naming convention
Each app has its own PostgreSQL user and database. Kebab-case app names use hyphens for users and underscores for databases:
- User: `<app-name>_user` (hyphens allowed, e.g. `skillcraft-interlingua_user`)
- Database: `<app_name>` (underscores, e.g. `skillcraft_interlingua`)

### 4. Migration files need IF NOT EXISTS
The VPS doesn't use Drizzle migration tracking. SQL migrations are run manually. Always use:
- `CREATE TABLE IF NOT EXISTS` for tables
- `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` for columns
- Never rely on `CREATE TABLE` without `IF NOT EXISTS` — it will error on existing tables

### 5. Build output
The standard build produces `dist/index.cjs` (server) and `dist/public/` (frontend assets).
Production command: `node dist/index.cjs`

### 6. Git deployment flow
Apps use GitHub repos. Deploy by running `git pull` on the VPS, then rebuild.
The user can push from Replit Shell tab: `git push origin main`

## Deploy a New App — Step by Step

### Step 1: Create PostgreSQL Database

Ask the user to run on VPS (two separate commands):
```bash
sudo -u postgres psql -c "CREATE USER \"<app-name>_user\" WITH PASSWORD '<strong_password>';"
sudo -u postgres psql -c "CREATE DATABASE <app_db> OWNER \"<app-name>_user\";"
```

Then grant schema permissions:
```bash
sudo -u postgres psql -d <app_db> -c "
GRANT ALL ON SCHEMA public TO \"<app-name>_user\";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO \"<app-name>_user\";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO \"<app-name>_user\";
"
```

### Step 2: Clone and Build

```bash
cd /var/www
git clone https://github.com/<org>/<repo>.git <app-name>
cd <app-name>
npm install --include=dev
npm run build
```

### Step 3: Run Database Migrations

Run each migration file in order:
```bash
for f in migrations/*.sql; do
  echo "Running $f..."
  psql "postgresql://<app-name>_user:<password>@localhost:5432/<app_db>" -f "$f"
done
```

### Step 4: Set Up PM2 with Ecosystem File

Check existing ports to avoid conflicts: `pm2 list`

Create ecosystem config:
```bash
cat > ecosystem.config.cjs << 'EOF'
module.exports = {
  apps: [{
    name: '<app-name>',
    script: 'dist/index.cjs',
    env: {
      PORT: <port>,
      DATABASE_URL: 'postgresql://<app-name>_user:<password>@localhost:5432/<app_db>',
      NODE_ENV: 'production',
    }
  }]
};
EOF
pm2 start ecosystem.config.cjs
pm2 save
```

To update env vars later, edit `ecosystem.config.cjs` then:
```bash
pm2 restart <app-name> --update-env
pm2 save
```

Ensure PM2 restarts on reboot:
```bash
pm2 startup
pm2 save
```

### Step 5: App-Specific Environment Variables

Check what env vars the app needs beyond `PORT` and `DATABASE_URL`. Common ones:
- `SESSION_SECRET` — for session-based auth
- API keys for third-party services (CRM, PayPal, AI, etc.)
- `ADMIN_EMAIL` — for admin panel access

Add all required vars to `ecosystem.config.cjs` and restart with `--update-env`.

### Step 6: Configure Nginx

Create Nginx config:
```bash
cat > /etc/nginx/sites-available/<domain> << 'EOF'
server {
    listen 80;
    server_name <domain>;

    location / {
        proxy_pass http://localhost:<port>;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

ln -s /etc/nginx/sites-available/<domain> /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### Step 7: SSL Certificate

```bash
certbot --nginx -d <domain>
```

### Step 8: Post-Deploy Validation

```bash
pm2 describe <app-name>
pm2 logs <app-name> --lines 10 --err
curl -s -o /dev/null -w "%{http_code}" http://localhost:<port>
curl -s -o /dev/null -w "%{http_code}" https://<domain>
```

All should return `200`. If error logs show issues, check the Troubleshooting section.

## Update an Existing App

```bash
cd /var/www/<app-name>
git pull
npm install --include=dev
npm run build
```

If there are new database tables/columns, run migrations BEFORE restarting:
```bash
DB_URL=$(pm2 env $(pm2 id <app-name> | tr -d '[]') | grep DATABASE_URL | awk -F': ' '{print $2}')
for f in migrations/*.sql; do psql "$DB_URL" -f "$f"; done
```

Then restart:
```bash
pm2 restart <app-name>
```

## Troubleshooting

### Check logs
```bash
pm2 logs <app-name> --lines 30
pm2 logs <app-name> --lines 30 --err
```

### Check which database an app uses
```bash
pm2 env $(pm2 id <app-name> | tr -d '[]') | grep DATABASE
```

### Check all running apps
```bash
pm2 list
```

### Check Nginx config
```bash
nginx -t
cat /etc/nginx/sites-available/<domain>
```

### Common errors
- **"relation X does not exist"**: Missing database table. Run migrations against the CORRECT database (check PM2 env, not .env file).
- **"Cannot find package 'esbuild'"**: Need `npm install --include=dev` not just `npm install`.
- **Build works but app shows old version**: Forgot to run `npm run build` after `git pull`, or PM2 wasn't restarted.
- **App starts but returns 502**: Wrong port in Nginx config, or app crashed on startup. Check `pm2 logs`.
- **Empty response from API calls**: Check if outbound HTTP is blocked or rate-limited from VPS. Test with `curl` directly.
