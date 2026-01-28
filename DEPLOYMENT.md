# Deployment Guide - SkillCraft-Interlingua

## App Details

| Setting | Value |
|---------|-------|
| App Name | skillcraft-interlingua |
| Domain | skillcraft-interlingua.interlingua.it |
| Port | 5005 |
| VPS IP | 72.62.36.128 |
| Directory | /var/www/SkillCraft-Interlingua |
| Database | skillcraft_interlingua |
| DB User | english_workout_user |
| GitHub | InterlinguaFormazione/SkillCraft-Interlingua |

---

## Initial Deployment (First Time)

### Step 1: Connect to VPS

```bash
ssh root@72.62.36.128
```

### Step 2: Create Database

```bash
sudo -u postgres psql
```

```sql
CREATE DATABASE skillcraft_interlingua OWNER english_workout_user;
\q
```

### Step 3: Create App Directory

```bash
mkdir -p /var/www/SkillCraft-Interlingua
cd /var/www/SkillCraft-Interlingua
```

### Step 4: Clone Repository

```bash
git clone https://github.com/InterlinguaFormazione/SkillCraft-Interlingua.git .
```

### Step 5: Create .env File

```bash
nano .env
```

Add:

```
NODE_ENV=production
PORT=5005
DATABASE_URL=postgresql://english_workout_user:YOUR_PASSWORD@localhost:5432/skillcraft_interlingua
SESSION_SECRET=your_random_secret_here
```

Generate a session secret:

```bash
openssl rand -base64 32
```

### Step 6: Install Dependencies

```bash
npm install
```

### Step 7: Build Application

```bash
npm run build
```

### Step 8: Setup Nginx

```bash
cp nginx/skillcraft-interlingua.conf /etc/nginx/sites-available/
ln -sf /etc/nginx/sites-available/skillcraft-interlingua.conf /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### Step 9: Get SSL Certificate

```bash
certbot --nginx -d skillcraft-interlingua.interlingua.it
```

### Step 10: Create PM2 Log Directory

```bash
mkdir -p /var/log/pm2
```

### Step 11: Start with PM2

```bash
pm2 start ecosystem.config.cjs --env production
pm2 save
```

### Step 12: Verify

```bash
pm2 status
curl http://localhost:5005
```

Visit: https://skillcraft-interlingua.interlingua.it

---

## Updating the App

### Option 1: Quick Update

```bash
cd /var/www/SkillCraft-Interlingua
./scripts/deploy.sh
```

### Option 2: Manual Update

```bash
cd /var/www/SkillCraft-Interlingua
git pull origin main
npm install
npm run build
pm2 restart skillcraft-interlingua
```

---

## Useful Commands

### PM2

```bash
# Status
pm2 status

# Logs
pm2 logs skillcraft-interlingua

# Restart
pm2 restart skillcraft-interlingua

# Stop
pm2 stop skillcraft-interlingua

# Delete
pm2 delete skillcraft-interlingua

# Monitor
pm2 monit
```

### Nginx

```bash
# Test config
nginx -t

# Reload
systemctl reload nginx

# Restart
systemctl restart nginx

# Logs
tail -f /var/log/nginx/skillcraft-interlingua.error.log
tail -f /var/log/nginx/skillcraft-interlingua.access.log
```

### Database

```bash
# Connect
sudo -u postgres psql -d skillcraft_interlingua

# Backup
pg_dump -U english_workout_user skillcraft_interlingua > backup.sql

# Restore
psql -U english_workout_user skillcraft_interlingua < backup.sql
```

---

## Troubleshooting

### App won't start

```bash
pm2 logs skillcraft-interlingua --lines 100
cat /var/log/pm2/skillcraft-interlingua-error.log
```

### 502 Bad Gateway

Check if app is running:

```bash
pm2 status
curl http://localhost:5005
```

### SSL issues

```bash
certbot renew --dry-run
```

### Port already in use

```bash
lsof -i :5005
kill -9 <PID>
```
