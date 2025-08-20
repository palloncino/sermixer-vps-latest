# SERMIXER SERVER - /var/www Directory Documentation

## **Current Production Versions**
- **Frontend (FE)**: `v2.0` - Production React application
- **Backend (BE)**: `server-v2.0` - Production Express.js API server

---

## **Directory Structure & Purpose**

### **🚀 Production Applications**
- **`v2.0/`** - Frontend React application (Production)
- **`server-v2.0/`** - Backend Express.js API server (Production)

### **📁 Core System Directories**
- **`html/`** - Default Apache/NGINX web root
- **`pdfs/`** - PDF file storage and serving
- **`images/`** - Image assets storage
- **`pdf-archives/`** - Archived PDF documents

### **🔄 Backup & Maintenance**
- **`database-backups/`** - Automated MySQL database backups
- **`backup_script.sh`** - Database backup automation script
- **`ecosystem.config.js`** - PM2 process management configuration

### **📚 Development & Documentation**
- **`developer-notes/`** - Development documentation and notes
- **`README.md`** - This file (current documentation)

### **🗑️ Deprecated Applications**
- **`deprecated--quotation-app-02/`** - Old frontend version (deprecated)
- **`deprecated--quotation-sql-server-01/`** - Old backend version (deprecated)

---

## **🚀 V3.0 UPGRADE PLAN**

### **Step 1: Clone New Applications**
```bash
# Clone Backend Server v3.0
git clone git@github.com:palloncino/sermixer-server-v2.0.git server-v3.0

# Clone Frontend Client v3.0  
git clone git@github.com:palloncino/sermixer-client-v2.0.git v3.0
```

### **Step 2: Environment Configuration Migration**
```bash
# Copy environment files from v2.0 to v3.0
cp server-v2.0/.env server-v3.0/.env
cp v2.0/.env v3.0/.env

# Update any version-specific configurations
# - Database connection strings
# - API endpoints
# - Environment variables
```

### **Step 3: Testing & Deployment**
```bash
# Test v3.0 applications
cd server-v3.0 && npm install && npm start
cd ../v3.0 && npm install && npm start

# Update NGINX configuration if needed
# Deploy to production
```

---

## **🔧 Current Setup Commands**

### **PM2 Process Management**
```bash
# Check running processes
pm2 list

# Monitor applications
pm2 monit

# View logs
pm2 logs server-v2.0 --lines 100
pm2 logs v2.0 --lines 100
```

### **Database Management**
```bash
# Connect to MySQL
mysql -u admin -p
# Password: 86mcrw!p10

# Use database
USE quotation-sql-database-01;
```

### **NGINX Management**
```bash
# Restart NGINX after configuration changes
sudo systemctl restart nginx

# Check NGINX status
sudo systemctl status nginx
```

---

## **📋 Environment Files Location**
- **Backend**: `/var/www/server-v2.0/.env`
- **Frontend**: `/var/www/v2.0/.env`
- **v3.0 Backend**: `/var/www/server-v3.0/.env` (after cloning)
- **v3.0 Frontend**: `/var/www/v3.0/.env` (after cloning)

---

## **🗄️ Database Information & Export**

### **Current Database Status**
- **Database Name**: `quotation-sql-database-01`
- **Total Tables**: 5
- **Tables**: `clients`, `documents`, `products`, `quotes`, `users`
- **Connection**: `mysql -u admin -p` (Password: 86mcrw!p10)

### **V3.0 Migration Export**
- **Export File**: `v3.0_migration_backup_2025-08-20_12-20-29.sql.gz`
- **Location**: `/var/www/database-backups/`
- **Size**: ~1.7 MB (compressed), ~12.4 MB (uncompressed)
- **Export Features**: 
  - Single transaction (consistent backup)
  - Includes routines and triggers
  - Add-drop-database statements
  - Full database creation options

### **Safe Export Commands**
```bash
# Create comprehensive export (use for v3.0 migration)
sudo mysqldump -u admin -p'86mcrw!p10' \
  --single-transaction \
  --routines \
  --triggers \
  --add-drop-database \
  --create-options \
  'quotation-sql-database-01' | sudo tee backup_name.sql > /dev/null

# Compress the export
sudo gzip backup_name.sql

# Verify export integrity
gunzip -t backup_name.sql.gz
```

---

## **⚠️ Important Notes**
- Always backup before major changes
- Test v3.0 applications thoroughly before production deployment
- Update NGINX configuration if API endpoints change
- Ensure database migrations are handled properly
- Monitor PM2 processes during deployment

---

*Last Updated: August 20, 2024*
*Next Update: After v3.0 deployment*
