#!/bin/bash

# ============================================
# Deployment Script for SkillCraft-Interlingua
# Run this to update the application
# ============================================

set -e

APP_DIR="/var/www/SkillCraft-Interlingua"
APP_NAME="skillcraft-interlingua"

echo "========================================"
echo "  Deploying SkillCraft-Interlingua"
echo "========================================"

cd $APP_DIR

echo "1. Pulling latest code..."
git pull origin main

echo "2. Installing dependencies..."
npm install

echo "3. Building application..."
npm run build

echo "4. Restarting PM2 process..."
pm2 restart $APP_NAME --env production

echo "5. Saving PM2 state..."
pm2 save

echo ""
echo "========================================"
echo "  Deployment Complete!"
echo "========================================"
echo ""
echo "Check status: pm2 status $APP_NAME"
echo "View logs: pm2 logs $APP_NAME"
