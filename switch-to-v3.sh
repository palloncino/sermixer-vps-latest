#!/bin/bash
# Switch to V3.0 - Quick switch script
echo "🔄 Switching to V3.0..."

# Update nginx configuration to serve V3
sudo sed -i 's|# V2.0 Frontend - Root application|# V2.0 Frontend - Root application (COMMENTED OUT - switched to V3)|' /etc/nginx/sites-available/sermixer
sudo sed -i 's|location / {|# location / {|' /etc/nginx/sites-available/sermixer
sudo sed -i 's|    alias /var/www/v2.0/;|#     alias /var/www/v2.0/;|' /etc/nginx/sites-available/sermixer
sudo sed -i 's|    try_files $uri $uri/ /index.html;|#     try_files $uri $uri/ /index.html;|' /etc/nginx/sites-available/sermixer
sudo sed -i 's|}|# }|' /etc/nginx/sites-available/sermixer

sudo sed -i 's|# V3.0 Frontend - Root application (COMMENTED OUT - uncomment to switch to V3)|# V3.0 Frontend - Root application (ACTIVE)|' /etc/nginx/sites-available/sermixer
sudo sed -i 's|# location / {|location / {|' /etc/nginx/sites-available/sermixer
sudo sed -i 's|#     alias /var/www/v3.0/app/build/;|    alias /var/www/v3.0/app/build/;|' /etc/nginx/sites-available/sermixer
sudo sed -i 's|#     try_files $uri $uri/ /index.html;|    try_files $uri $uri/ /index.html;|' /etc/nginx/sites-available/sermixer
sudo sed -i 's|# }|}|' /etc/nginx/sites-available/sermixer

# Update API routing to V3
sudo sed -i 's|# V2.0 API (Currently active)|# V2.0 API (COMMENTED OUT - switched to V3)|' /etc/nginx/sites-available/sermixer
sudo sed -i 's|location /api {|# location /api {|' /etc/nginx/sites-available/sermixer
sudo sed -i 's|    proxy_pass http://localhost:5004;|#     proxy_pass http://localhost:5004;|' /etc/nginx/sites-available/sermixer
sudo sed -i 's|    proxy_http_version 1.1;|#     proxy_http_version 1.1;|' /etc/nginx/sites-available/sermixer
sudo sed -i 's|    proxy_set_header Upgrade $http_upgrade;|#     proxy_set_header Upgrade $http_upgrade;|' /etc/nginx/sites-available/sermixer
sudo sed -i 's|    proxy_set_header Connection "upgrade";|#     proxy_set_header Connection "upgrade";|' /etc/nginx/sites-available/sermixer
sudo sed -i 's|    proxy_set_header Host $host;|#     proxy_set_header Host $host;|' /etc/nginx/sites-available/sermixer
sudo sed -i 's|    proxy_cache_bypass $http_upgrade;|#     proxy_cache_bypass $http_upgrade;|' /etc/nginx/sites-available/sermixer
sudo sed -i 's|}|# }|' /etc/nginx/sites-available/sermixer

sudo sed -i 's|# V3.0 API (COMMENTED OUT - uncomment to switch to V3)|# V3.0 API (ACTIVE)|' /etc/nginx/sites-available/sermixer
sudo sed -i 's|# location /api {|location /api {|' /etc/nginx/sites-available/sermixer
sudo sed -i 's|#     proxy_pass http://localhost:5006;|    proxy_pass http://localhost:5006;|' /etc/nginx/sites-available/sermixer
sudo sed -i 's|#     proxy_http_version 1.1;|    proxy_http_version 1.1;|' /etc/nginx/sites-available/sermixer
sudo sed -i 's|#     proxy_set_header Upgrade $http_upgrade;|    proxy_set_header Upgrade $http_upgrade;|' /etc/nginx/sites-available/sermixer
sudo sed -i 's|#     proxy_set_header Connection "upgrade";|    proxy_set_header Connection "upgrade";|' /etc/nginx/sites-available/sermixer
sudo sed -i 's|#     proxy_set_header Host $host;|    proxy_set_header Host $host;|' /etc/nginx/sites-available/sermixer
sudo sed -i 's|#     proxy_cache_bypass $http_upgrade;|    proxy_cache_bypass $http_upgrade;|' /etc/nginx/sites-available/sermixer
sudo sed -i 's|# }|}|' /etc/nginx/sites-available/sermixer

# Test nginx configuration
if sudo nginx -t; then
    echo "✅ Nginx configuration valid"
    # Reload nginx
    sudo systemctl reload nginx
    echo "✅ Switched to V3.0 successfully!"
    echo "🌐 V3.0 is now live at: http://sermixer.micro-cloud.it:12923/"
    echo "🧪 Testing V3.0..."
    curl -s http://localhost/ | grep -o 'src="/[^"]*"' | head -2
else
    echo "❌ Nginx configuration error - manual intervention required"
    exit 1
fi
