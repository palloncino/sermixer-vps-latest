# Server Configuration Guide

## SSH Connection

To connect to the server:
```bash
ssh microweb@sermixer.micro-cloud.it -p 12922
```

For persistent connections, add to `~/.ssh/config`:
```bash
# Set default options for all hosts
Host *
  ServerAliveInterval 60
  ServerAliveCountMax 500
```

## NGINX Configuration

The server uses port 12923 for HTTP traffic due to DNS settings. Configuration file location:
```bash
/etc/nginx/sites-available/sermixer
```

Current configuration:
```nginx
server {
    listen 80;
    server_name sermixer.micro-cloud.it;
    client_max_body_size 50M;

    # Serve v2.0 as the root application
    location / {
        alias /var/www/v2.0/;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5004;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Other locations...
}
```

### Important Paths
- Frontend: `/var/www/v2.0/`
- Backend: `/var/www/server-v2.0/`
- PDFs: `/var/www/pdfs/`
- Images: `/var/www/images/`
- Logs: `/var/www/server-v2.0/logs/`

## Node.js Server Management

Using PM2 for process management:

```bash
# Start server
NODE_ENV=production PORT=5004 pm2 start server.js --name server-v2.0

# Stop server
pm2 stop server-v2.0

# Monitor
pm2 monit

# View logs
pm2 logs server-v2.0 --lines 100
```

## Database Management

### MySQL Commands
```bash
mysql -u admin -p

SHOW DATABASES;
USE quotation-sql-database-01;
SHOW TABLES;
SELECT * FROM users\G;
```

### Backup System
- **Script**: `/var/www/backup_script.sh`
- **Backup Directory**: `/var/www/database-backups`
- **Schedule**: Daily at 2 AM UTC

Monitor backups:
```bash
# Check timer status
sudo systemctl status backup_script.timer

# View backup logs
journalctl -u backup_script.service

# List backups
ls -1 /var/www/database-backups
```

## Maintenance Notes

### File Permissions
```bash
# Set correct permissions for logs
sudo chown -R microweb:microweb /var/www/server-v2.0/logs
sudo chmod 755 /var/www/server-v2.0/logs

# Set permissions for images
sudo chown -R microweb:microweb /var/www/images
sudo chmod 755 /var/www/images
```

### PDF Archival System

The system automatically archives PDFs older than 60 days on the 1st of each month.

**Configuration:**
```bash
# Script location
/var/www/server-v2.0/scripts/archive-pdfs.sh

# Archive location
/var/www/pdf-archives

# Cronjob (runs at 1 AM on the 1st of each month)
0 1 1 * * /var/www/server-v2.0/scripts/archive-pdfs.sh
```

**Features:**
- Archives PDFs older than 60 days
- Maintains 6-month rolling archive
- Logs operations to /var/www/server-v2.0/logs/pdf-archive.log
- Monitors disk usage

**Manual Archive:**
```bash
# Run archive manually
/var/www/server-v2.0/scripts/archive-pdfs.sh

# View archive logs
tail -f /var/www/server-v2.0/logs/pdf-archive.log

# List archives
ls -lh /var/www/pdf-archives
```

### Required Files
- Business Signature: `/var/www/images/BUSINESS_SIGNATURE.png`
- Environment: `/var/www/server-v2.0/.env.remote`

### After Configuration Changes
```bash
# Restart nginx
sudo systemctl restart nginx

# Restart Node.js server
pm2 restart server-v2.0
```

# EXPRESS SERVER

> /var/www/quotation-sql-server-01

We use **pm2** to manage the app, because it offers debug utilities to monitoring and out logging.

Go to directory: **/var/www/quotation-sql-server-01**

**Stop App**:
```bash
pm2 stop quotation-sql-server-01
```

**Start App**:
```bash
npm start
```


**Monitoring**: To keep an eye on the application, you can use
```bash
pm2 monit
```

**Logging**: If you need to view logs for debugging or checking outputs, use
```bash
pm2 logs quotation-sql-server-01 --lines 100
```

<br>
<hr >
<br>

# SQL COMMANDS

### The usual commands

mysql -u admin -p

SHOW DATABASES

USE quotation-sql-database-01

SHOW TABLES;

SELECT * FROM users\G;

UPDATE users SET role = 'admin' WHERE email = 'powerhydratoni@gmail.com';

DROP TABLE users;


# MySQL Backup with systemd Timer

**Setup Overview:**
- **Script Location**: `/var/www/backup_script.sh`
- **Backup Directory**: `/var/www/database-backups`
- **Timer**: Runs daily at 2 AM UTC via `systemd`.

**Key Commands:**
- **Check Timer Status**:  
  `sudo systemctl status backup_script.timer`
- **Check Service Status**:  
  `sudo systemctl status backup_script.service`
- **Manually Run Backup**:  
  `sudo systemctl start backup_script.service`
- **View Logs**:  
  `journalctl -u backup_script.service`
- **Enable Timer at Boot**:  
  `sudo systemctl enable backup_script.timer`

**Verification:**
- **Check for New Backups**:  
  `ls -1 /var/www/database-backups`
