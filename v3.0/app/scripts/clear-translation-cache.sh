#!/bin/bash

# Clear Translation Cache Script
# This script ensures translation files are not cached by adding cache-busting headers
# and optionally versioning the files

echo "🔄 Starting translation cache clearing process..."

# Set the project directory
PROJECT_DIR="/var/www/v3.0/app"
LOCALES_DIR="$PROJECT_DIR/public/locales"

# Function to clear browser cache by adding cache-busting headers
clear_browser_cache() {
    echo "📝 Adding cache-busting headers..."
    
    # Create .htaccess file in public/locales to prevent caching
    cat > "$LOCALES_DIR/.htaccess" << 'EOF'
# Prevent caching of translation files
<FilesMatch "\.(json)$">
    Header set Cache-Control "no-cache, no-store, must-revalidate"
    Header set Pragma "no-cache"
    Header set Expires "0"
</FilesMatch>

# Add versioning headers
<FilesMatch "\.v[0-9]+\.json$">
    Header set Cache-Control "no-cache, no-store, must-revalidate"
    Header set Pragma "no-cache"
    Header set Expires "0"
    Header set Last-Modified "Thu, 01 Jan 1970 00:00:00 GMT"
    Header set If-Modified-Since "Thu, 01 Jan 1970 00:00:00 GMT"
    Header set If-None-Match "off"
    Header set ETag "off"
</FilesMatch>
EOF
    
    echo "✅ Created .htaccess with no-cache headers"
}

# Function to add timestamp to force reload
add_timestamp() {
    echo "⏰ Adding timestamp to force file reload..."
    
    # Add timestamp comment to translation files
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    for file in "$LOCALES_DIR"/*.json; do
        if [ -f "$file" ]; then
            # Create temporary file with timestamp
            local temp_file="${file}.tmp"
            {
                echo "// Last updated: $timestamp"
                cat "$file"
            } > "$temp_file"
            
            # Replace original with timestamped version
            mv "$temp_file" "$file"
            echo "  ✓ Updated: $(basename "$file")"
        fi
    done
}

# Function to clear service worker cache (if applicable)
clear_service_worker_cache() {
    echo "🧹 Clearing service worker cache..."
    
    # Create a cache-busting script for the frontend
    cat > "$PROJECT_DIR/public/clear-cache.js" << 'EOF'
// Cache clearing utility
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
            registration.unregister();
        }
        console.log('Service workers unregistered');
    });
}

// Clear all caches
if ('caches' in window) {
    caches.keys().then(function(names) {
        names.forEach(function(name) {
            caches.delete(name);
        });
        console.log('All caches cleared');
    });
}

// Force reload without cache
window.location.reload(true);
EOF
    
    echo "✅ Created cache clearing script at public/clear-cache.js"
}

# Function to update i18n config with cache busting
update_i18n_config() {
    echo "⚙️ Updating i18n configuration for cache busting..."
    
    local i18n_file="$PROJECT_DIR/src/i18n.js"
    local timestamp=$(date +%s)
    
    # Backup original
    cp "$i18n_file" "$i18n_file.backup"
    
    # Update loadPath with timestamp
    sed -i "s|loadPath: '/locales/{{lng}}.v1.json'|loadPath: '/locales/{{lng}}.v1.json?v=$timestamp'|g" "$i18n_file"
    
    echo "✅ Updated i18n.js with cache-busting timestamp: $timestamp"
}

# Function to restart development server (if running)
restart_dev_server() {
    echo "🔄 Checking for running development server..."
    
    # Check if yarn/npm dev server is running
    local pid=$(pgrep -f "yarn start\|npm start\|yarn dev\|npm run dev" | head -1)
    
    if [ ! -z "$pid" ]; then
        echo "🛑 Found development server (PID: $pid), restarting..."
        echo "ℹ️  You may need to manually restart your development server"
        echo "   Run: yarn start or npm start in $PROJECT_DIR"
    else
        echo "ℹ️  No development server found running"
    fi
}

# Main execution
main() {
    echo "🎯 Target directory: $LOCALES_DIR"
    
    # Check if locales directory exists
    if [ ! -d "$LOCALES_DIR" ]; then
        echo "❌ Error: Locales directory not found at $LOCALES_DIR"
        exit 1
    fi
    
    # Execute cache clearing steps
    clear_browser_cache
    add_timestamp
    clear_service_worker_cache
    update_i18n_config
    restart_dev_server
    
    echo ""
    echo "🎉 Translation cache clearing completed!"
    echo ""
    echo "📋 Manual steps you may need to take:"
    echo "   1. Hard refresh your browser (Ctrl+F5 or Cmd+Shift+R)"
    echo "   2. Open browser dev tools and disable cache"
    echo "   3. Clear browser storage: Application > Storage > Clear"
    echo "   4. Restart your development server"
    echo ""
    echo "🔧 Files modified:"
    echo "   - $LOCALES_DIR/.htaccess (created)"
    echo "   - $PROJECT_DIR/public/clear-cache.js (created)"
    echo "   - $PROJECT_DIR/src/i18n.js (updated with timestamp)"
    echo "   - All JSON files in $LOCALES_DIR (timestamped)"
    echo ""
}

# Run the script
main "$@"
