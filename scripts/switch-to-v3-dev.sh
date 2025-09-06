#!/bin/bash

echo "🔄 Switching V3 to Development Mode..."

# Check if dev server is running
if ! pgrep -f "yarn start" > /dev/null; then
    echo "⚠️  Dev server not running. Starting it..."
    cd /var/www/v3.0/app
    yarn start &
    sleep 10
fi

# Create a clean Nginx config for dev mode
sudo tee /etc/nginx/sites-available/sermixer > /dev/null << 'EOF'
server {
    listen 80;
    listen 12923;
    server_name sermixer.micro-cloud.it;
    client_max_body_size 50M;

    # ===== VERSION SWITCHING =====
    # Currently serving V3.0 in Development Mode
    
    # V3.0 Frontend - Development Mode (ACTIVE)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # V3.0 API (ACTIVE)
    location /api {
        rewrite ^/api/(.*) /v3.0/api/$1 break;
        proxy_pass http://localhost:5006;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Serve PDFs from the /pdfs directory
    location /pdfs {
        alias /var/www/pdfs;
        autoindex off;
        try_files $uri =404;
    }

    # Serve phpMyAdmin
    location /phpmyadmin {
        alias /usr/share/phpmyadmin;
        index index.php;

        location ~ \.php$ {
            try_files $uri $uri/ /index.php =404;
            fastcgi_pass unix:/run/php/php8.1-fpm.sock;
            fastcgi_index index.php;
            include fastcgi_params;
            fastcgi_param SCRIPT_FILENAME $request_filename;
        }
    }

    # Serve images from the /images directory
    location /images {
        alias /var/www/images;
        try_files $uri =404;
    }
}
EOF

# Test and reload Nginx
if sudo nginx -t; then
    sudo systemctl reload nginx
    echo "✅ V3 Development Mode Active!"
    echo "🌐 Frontend: http://sermixer.micro-cloud.it:12923/"
    echo "🔥 Hot reload enabled - changes will appear instantly!"
    echo ""
    echo "📝 To switch back to production:"
    echo "   ./scripts/switch-to-v3-prod.sh"
else
    echo "❌ Nginx configuration error"
    exit 1
fi