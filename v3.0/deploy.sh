#!/bin/bash

# Define variables
SERVER_USER="microweb"
SERVER_IP="sermixer.micro-cloud.it"
LOCAL_BUILD_DIR="./app/build"
REMOTE_DIR="/var/www/v2.0"

echo "Running from directory: $(pwd)"
echo "Deploying files from $LOCAL_BUILD_DIR to $SERVER_USER@$SERVER_IP:$REMOTE_DIR"

# Check if the build directory exists
if [ ! -d "$LOCAL_BUILD_DIR" ]; then
  echo "Build directory does not exist: $LOCAL_BUILD_DIR"
  exit 1
fi

# Sync files to the server using rsync
rsync -rlpDvz --delete $LOCAL_BUILD_DIR/ $SERVER_USER@$SERVER_IP:$REMOTE_DIR
if [ $? -eq 0 ]; then
    echo "Rsync completed successfully."
else
    echo "Rsync failed with status $?"
    exit 1
fi

# SSH command to reload Nginx with pseudo-terminal allocation
ssh -t $SERVER_USER@$SERVER_IP "sudo systemctl reload nginx"
if [ $? -eq 0 ]; then
    echo "Nginx reloaded successfully."
else
    echo "Failed to reload Nginx with status $?"
    exit 1
fi

echo "Deployment complete."
