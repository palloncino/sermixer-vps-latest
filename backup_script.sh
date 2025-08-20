#!/bin/bash

# Define variables
BACKUP_DIR="/var/www/database-backups"
BACKUP_NAME="backup_$(date +%F_%H-%M-%S).sql"  # Use .sql extension for MySQL dumps
DATABASE="quotation-sql-database-01"  # Replace with your actual database name
USER="root"  # Replace with root
PASSWORD="86mcrw!p10"  # Replace with your root password

# Create the backup using mysqldump
mysqldump -u $USER -p$PASSWORD $DATABASE > $BACKUP_DIR/$BACKUP_NAME

# Cleanup old backups (older than 90 days)
find $BACKUP_DIR -type f -name "*.sql" -mtime +90 -exec rm {} \;

