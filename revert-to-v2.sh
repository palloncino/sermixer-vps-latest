#!/bin/bash
# Revert to V2.0 - Quick switch script
echo "🔄 Reverting to V2.0..."

# Restore V2.0 configuration
sudo cp /etc/nginx/sites-available/sermixer.backup-v2-2025-09-05_12-59-30 /etc/nginx/sites-available/sermixer

# Test nginx configuration
if sudo nginx -t; then
    echo "✅ Nginx configuration valid"
    # Reload nginx
    sudo systemctl reload nginx
    echo "✅ Reverted to V2.0 successfully!"
    echo "🌐 V2.0 is now live at: http://sermixer.micro-cloud.it:12923/"
    echo "🧪 Testing V2.0..."
    curl -s http://localhost/ | grep -o 'src="/[^"]*"' | head -2
else
    echo "❌ Nginx configuration error - manual intervention required"
    exit 1
fi
