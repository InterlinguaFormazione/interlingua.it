#!/bin/bash

# ============================================
# Initial Setup Script for SkillCraft-Interlingua
# Run once on a fresh server or to add this app
# ============================================

set -e

APP_DIR="/var/www/SkillCraft-Interlingua"
APP_NAME="skillcraft-interlingua"
DOMAIN="skillcraft-interlingua.interlingua.it"
PORT=5005

echo "========================================"
echo "  SkillCraft-Interlingua - Setup"
echo "========================================"

# Create application directory
echo "Creating application directory..."
mkdir -p $APP_DIR
cd $APP_DIR

# Clone repository
echo "Cloning repository..."
git clone https://github.com/InterlinguaFormazione/SkillCraft-Interlingua.git .

# Create .env file
echo "Creating .env file..."
cat > .env << EOF
NODE_ENV=production
PORT=$PORT
DATABASE_URL=postgresql://english_workout_user:YOUR_PASSWORD@localhost:5432/skillcraft_interlingua
SESSION_SECRET=$(openssl rand -base64 32)
EOF

echo "Please edit .env with your actual database password:"
echo "  nano $APP_DIR/.env"

# Create PM2 log directory
echo "Creating log directory..."
mkdir -p /var/log/pm2

# Install dependencies
echo "Installing dependencies..."
npm install

# Build application
echo "Building application..."
npm run build

# Setup Nginx
echo "Setting up Nginx..."
cp nginx/skillcraft-interlingua.conf /etc/nginx/sites-available/
ln -sf /etc/nginx/sites-available/skillcraft-interlingua.conf /etc/nginx/sites-enabled/

echo "Testing Nginx configuration..."
nginx -t

echo "Reloading Nginx..."
systemctl reload nginx

echo ""
echo "========================================"
echo "  Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Create the database:"
echo "   sudo -u postgres psql"
echo "   CREATE DATABASE skillcraft_interlingua OWNER english_workout_user;"
echo "   \\q"
echo ""
echo "2. Edit .env with your database password:"
echo "   nano $APP_DIR/.env"
echo ""
echo "3. Get SSL certificate:"
echo "   sudo certbot --nginx -d $DOMAIN"
echo ""
echo "4. Start the application:"
echo "   cd $APP_DIR"
echo "   pm2 start ecosystem.config.cjs --env production"
echo "   pm2 save"
echo ""
