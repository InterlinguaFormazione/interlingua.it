#!/bin/bash

# ============================================
# Server Setup Script for English Workout
# VPS: Ubuntu 22.04+ / Debian 11+
# ============================================

set -e

echo "========================================"
echo "  English Workout - Server Setup"
echo "========================================"

# Update system
echo "Updating system packages..."
apt update && apt upgrade -y

# Install essential tools
echo "Installing essential tools..."
apt install -y curl wget git build-essential software-properties-common

# Install Node.js 20.x
echo "Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Verify Node installation
echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"

# Install PM2 globally
echo "Installing PM2..."
npm install -g pm2

# Install Nginx
echo "Installing Nginx..."
apt install -y nginx

# Install Certbot for SSL
echo "Installing Certbot..."
apt install -y certbot python3-certbot-nginx

# Install PostgreSQL (optional - if needed locally)
echo "Installing PostgreSQL..."
apt install -y postgresql postgresql-contrib

# Start and enable services
echo "Starting services..."
systemctl enable nginx
systemctl start nginx
systemctl enable postgresql
systemctl start postgresql

# Setup firewall
echo "Configuring firewall..."
ufw allow 'Nginx Full'
ufw allow OpenSSH
ufw --force enable

# Create application directory
echo "Creating application directory..."
mkdir -p /var/www/english-workout
chown -R $SUDO_USER:$SUDO_USER /var/www/english-workout

echo ""
echo "========================================"
echo "  Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Create PostgreSQL user and database:"
echo "   sudo -u postgres psql"
echo "   CREATE USER english_workout_user WITH PASSWORD 'your_secure_password';"
echo "   CREATE DATABASE english_workout OWNER english_workout_user;"
echo "   \\q"
echo ""
echo "2. Clone your repository to /var/www/english-workout"
echo ""
echo "3. Create .env file with your configuration"
echo ""
echo "4. Install Nginx config:"
echo "   sudo cp nginx/english-workout.conf /etc/nginx/sites-available/"
echo "   sudo ln -s /etc/nginx/sites-available/english-workout.conf /etc/nginx/sites-enabled/"
echo "   sudo nginx -t && sudo systemctl reload nginx"
echo ""
echo "5. Get SSL certificate:"
echo "   sudo certbot --nginx -d english-workout.interlingua.it"
echo ""
echo "6. Build and start the application:"
echo "   npm install && npm run build"
echo "   pm2 start ecosystem.config.cjs --env production"
echo "   pm2 save && pm2 startup"
echo ""
