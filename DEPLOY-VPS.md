# Deployment su VPS — SkillCraft-Interlingua

## Requisiti VPS

- **Node.js 20+** (consigliato: v20 LTS)
- **PostgreSQL 15+**
- **Nginx** (reverse proxy)
- **PM2** (process manager, opzionale ma consigliato)
- **Certbot** (per SSL/HTTPS)

---

## 1. Preparazione VPS

```bash
# Installa Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installa PM2
sudo npm install -g pm2

# Installa Nginx
sudo apt-get install -y nginx

# Installa Certbot per SSL
sudo apt-get install -y certbot python3-certbot-nginx
```

---

## 2. Database PostgreSQL

```bash
# Se PostgreSQL non è già installato:
sudo apt-get install -y postgresql postgresql-contrib

# Crea database e utente
sudo -u postgres psql
```

```sql
CREATE USER skillcraft WITH PASSWORD 'UNA_PASSWORD_SICURA';
CREATE DATABASE skillcraft_db OWNER skillcraft;
GRANT ALL PRIVILEGES ON DATABASE skillcraft_db TO skillcraft;
\q
```

---

## 3. Upload del codice

```bash
# Crea la directory del progetto
sudo mkdir -p /var/www/skillcraft
sudo chown $USER:$USER /var/www/skillcraft

# Dal tuo computer locale, copia i file necessari:
# Opzione A: Git clone (se hai un repo)
# Opzione B: SCP/rsync dalla macchina Replit

# File e cartelle da copiare:
# - package.json
# - package-lock.json (se presente)
# - dist/              (build di produzione)
# - drizzle.config.ts
# - shared/            (schema)
# - server/            (per le migrazioni)
```

Oppure, più semplice, copia TUTTO il progetto e fai la build sul VPS:

```bash
# Sul VPS, nella directory del progetto:
cd /var/www/skillcraft
npm install
npm run build
```

---

## 4. Variabili d'ambiente

Crea il file `/var/www/skillcraft/.env`:

```bash
nano /var/www/skillcraft/.env
```

Contenuto:

```env
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL=postgresql://skillcraft:UNA_PASSWORD_SICURA@localhost:5432/skillcraft_db

# AWS SES (per email)
AWS_ACCESS_KEY_ID=la_tua_access_key
AWS_SECRET_ACCESS_KEY=la_tua_secret_key
AWS_REGION=eu-south-1

# CRM Webhook
CRM_WEBHOOK_API_KEY=sk-webhook-la-tua-chiave

# Google API (per recensioni)
GOOGLE_API_KEY=la_tua_google_api_key

# Session
SESSION_SECRET=genera_una_stringa_casuale_lunga
```

---

## 5. Migrazioni Database

```bash
cd /var/www/skillcraft
npx drizzle-kit push
```

---

## 6. Avvio con PM2

```bash
cd /var/www/skillcraft

# Avvia l'app
pm2 start dist/index.cjs --name skillcraft --env production

# Salva la configurazione PM2
pm2 save

# Configura avvio automatico al boot
pm2 startup
```

Comandi utili PM2:
```bash
pm2 status              # Stato
pm2 logs skillcraft     # Logs in tempo reale
pm2 restart skillcraft  # Riavvia
pm2 stop skillcraft     # Ferma
```

---

## 7. Configurazione Nginx

```bash
sudo nano /etc/nginx/sites-available/skillcraft
```

Contenuto:

```nginx
server {
    listen 80;
    server_name skillcraft.interlingua.it;

    location / {
        proxy_pass http://127.0.0.1:5000;
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
```

Attiva il sito:

```bash
sudo ln -s /etc/nginx/sites-available/skillcraft /etc/nginx/sites-enabled/
sudo nginx -t          # Verifica configurazione
sudo systemctl reload nginx
```

---

## 8. SSL con Certbot (HTTPS)

Assicurati che il DNS di `skillcraft.interlingua.it` punti al tuo VPS, poi:

```bash
sudo certbot --nginx -d skillcraft.interlingua.it
```

Certbot configurerà automaticamente il redirect HTTP -> HTTPS.

---

## 9. Verifica

```bash
# Controlla che l'app sia attiva
pm2 status

# Controlla i log
pm2 logs skillcraft

# Testa dal browser
curl https://skillcraft.interlingua.it
```

---

## Deploy automatico con GitHub Actions

Il progetto include un workflow GitHub Actions (`.github/workflows/deploy.yml`) che fa il deploy automatico ogni volta che fai push sul branch `main`.

### Setup (una volta sola)

Nel tuo repository GitHub, vai su **Settings > Secrets and variables > Actions** e aggiungi questi secrets:

| Secret | Descrizione | Esempio |
|--------|-------------|---------|
| `VPS_HOST` | IP o dominio del VPS | `123.45.67.89` |
| `VPS_USER` | Utente SSH | `deploy` o `root` |
| `VPS_SSH_KEY` | Chiave privata SSH | Il contenuto di `~/.ssh/id_rsa` |
| `VPS_PORT` | Porta SSH (opzionale) | `22` |

### Come generare la chiave SSH

```bash
# Sul tuo computer
ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/github_deploy

# Copia la chiave pubblica sul VPS
ssh-copy-id -i ~/.ssh/github_deploy.pub utente@tuo-vps

# Il contenuto di ~/.ssh/github_deploy (chiave PRIVATA) va nel secret VPS_SSH_KEY
cat ~/.ssh/github_deploy
```

### Come funziona

1. Fai push su `main` (da Replit, dal tuo computer, o da qualsiasi altro posto)
2. GitHub Actions compila il progetto
3. Copia i file compilati sul VPS via SSH
4. Installa le dipendenze, aggiorna il database, e riavvia l'app

### Aggiornamenti manuali (alternativa)

Se preferisci aggiornare manualmente:

```bash
cd /var/www/SkillCraft-Interlingua
git pull origin main
npm install
npm run build
pm2 restart skillcraft-interlingua
```

---

## Struttura file in produzione

```
/var/www/skillcraft/
├── .env                    # Variabili d'ambiente
├── dist/
│   ├── index.cjs           # Server Node.js compilato
│   └── public/             # Frontend compilato (HTML, CSS, JS)
│       ├── index.html
│       ├── favicon.png
│       └── assets/         # JS/CSS bundle
├── package.json
├── node_modules/
└── drizzle.config.ts       # Per le migrazioni
```
