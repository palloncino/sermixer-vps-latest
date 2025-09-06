#!/bin/bash

echo "🔄 Switching V3 to Production Mode..."

# Update Nginx config for production mode
sudo sed -i 's|# V3.0 Frontend - Development Mode (ACTIVE)|# V3.0 Frontend - Production Mode (ACTIVE)|' /etc/nginx/sites-available/sermixer
sudo sed -i 's|proxy_pass http://localhost:3000;|alias /var/www/v3.0/app/build/;|' /etc/nginx/sites-available/sermixer
sudo sed -i 's|# try_files not needed for dev server|try_files $uri $uri/ /index.html;|' /etc/nginx/sites-available/sermixer

# Restore static asset locations for production mode
sudo sed -i 's|# location /static/ {|location /static/ {|' /etc/nginx/sites-available/sermixer
sudo sed -i 's|# alias /var/www/v3.0/app/build/static/;|alias /var/www/v3.0/app/build/static/;|' /etc/nginx/sites-available/sermixer
sudo sed -i 's|# }|}|' /etc/nginx/sites-available/sermixer

sudo sed -i 's|# location /locales/ {|location /locales/ {|' /etc/nginx/sites-available/sermixer
sudo sed -i 's|# alias /var/www/v3.0/app/build/locales/;|alias /var/www/v3.0/app/build/locales/;|' /etc/nginx/sites-available/sermixer

sudo sed -i 's|# location /favicon.ico {|location /favicon.ico {|' /etc/nginx/sites-available/sermixer
sudo sed -i 's|# alias /var/www/v3.0/app/build/favicon.ico;|alias /var/www/v3.0/app/build/favicon.ico;|' /etc/nginx/sites-available/sermixer

# Test and reload Nginx
if sudo nginx -t; then
    sudo systemctl reload nginx
    echo "✅ V3 Production Mode Active!"
    echo "🌐 Frontend: http://sermixer.micro-cloud.it:12923/"
    echo "📦 Serving static build files"
    echo ""
    echo "📝 To switch to development:"
    echo "   ./switch-to-v3-dev.sh"
else
    echo "❌ Nginx configuration error"
    exit 1
fi
