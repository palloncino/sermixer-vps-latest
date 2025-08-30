#!/bin/bash

# Quick Translation Cache Clear Script
echo "🔄 Clearing translation file cache..."

# Add timestamp to i18n config for cache busting
TIMESTAMP=$(date +%s)
sed -i "s|loadPath: '/v3.0/locales/{{lng}}.v1.json.*'|loadPath: '/v3.0/locales/{{lng}}.v1.json?v=$TIMESTAMP'|g" src/i18n.js

# Copy v1 translation files to build directory (if it exists)
if [ -d "build/locales" ]; then
    echo "📁 Copying v1 files to build directory..."
    cp public/locales/*.v1.json build/locales/
    echo "✅ v1 files copied to build/locales/"
fi

# Add cache-busting headers to public directory
mkdir -p public/locales
cat > public/locales/.htaccess << 'EOF'
<FilesMatch "\.(json)$">
    Header set Cache-Control "no-cache, no-store, must-revalidate"
    Header set Pragma "no-cache"
    Header set Expires "0"
</FilesMatch>
EOF

# Touch translation files to update modification time
touch public/locales/*.json
if [ -d "build/locales" ]; then
    touch build/locales/*.json
fi

echo "✅ Cache cleared! Timestamp: $TIMESTAMP"
echo "📝 Updated src/i18n.js with cache-busting parameter"
echo "📁 Updated both public and build directories"
echo "🔄 Please hard refresh your browser (Ctrl+F5)"
