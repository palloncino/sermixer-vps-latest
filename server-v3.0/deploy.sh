#!/bin/bash

# Define variables
SERVER_USER="microweb"  # Username for SSH
SERVER_IP="sermixer.micro-cloud.it"  # Server IP or domain
LOCAL_DIR="./app"  # Local directory of your Express.js app
REMOTE_DIR="/var/www/server-v2.0"  # Remote directory for the app

echo "Deploying files from $LOCAL_DIR to $SERVER_USER@$SERVER_IP:$REMOTE_DIR"

# Sync files to the server using rsync
rsync -rlpDvz --delete $LOCAL_DIR/ $SERVER_USER@$SERVER_IP:$REMOTE_DIR
if [ $? -eq 0 ]; then
    echo "Rsync completed successfully."
else
    echo "Rsync failed with status $?"
    exit 1
fi

# Set up directories and permissions
ssh $SERVER_USER@$SERVER_IP << 'EOF'
    cd /var/www/server-v2.0
    npm install
    sudo mkdir -p /var/www/server-v2.0/logs
    sudo chown -R microweb:microweb /var/www/server-v2.0
    sudo chmod 755 /var/www/server-v2.0/logs
EOF

# SSH command to restart Node.js server
ssh $SERVER_USER@$SERVER_IP "cd /var/www/server-v2.0 && pm2 restart all"
if [ $? -eq 0 ]; then
    echo "Node.js server restarted successfully."
else
    echo "Failed to restart Node.js server with status $?"
    exit 1
fi

echo "Deployment complete."
