# SERMIXER v3.0 - Development Version

## 🚀 Quick Start

```shell
npm i
npm start
```

## 🌐 Nginx Configuration Discovery

### **Important Architecture Notes**

The v3.0 development version works alongside v2.0 production through a specific nginx configuration:

#### **Port Configuration:**
- **nginx listens on port 80** (internal)
- **External access via port 12923** (handled by network/load balancer)
- **v2.0 (Production)**: `http://sermixer.micro-cloud.it:12923/`
- **v3.0 (Development)**: `http://sermixer.micro-cloud.it:12923/v3.0/`

#### **How It Works:**
1. **Browser requests**: `http://sermixer.micro-cloud.it:12923/`
2. **Network/load balancer**: Routes port 12923 to the server
3. **nginx**: Listens on port 80 and serves appropriate content
4. **URL routing**: 
   - `/` → v2.0 production app
   - `/v3.0/` → v3.0 development app

#### **Key Discovery:**
- **nginx must listen on port 80** (not 12923)
- **Port 12923 is handled externally** by network configuration
- **Both versions share the same nginx instance** on port 80
- **v2.0 cannot be touched** - it's production
- **v3.0 gets the `/v3.0/` path prefix** for development

#### **PM2 Processes:**
- **v2.0 API**: `sermixer-api` on port 5004
- **v3.0 API**: `sermixer-api-v3.0` on port 5006
- **v3.0 Frontend**: `sermixer-frontend-v3.0` on port 3000

#### **Environment Files:**
- **v2.0**: Uses `.env.remote` with `PORT=5004`
- **v3.0**: Uses `.env.remote` with `PORT=5006`

This configuration ensures that production (v2.0) remains untouched while developers can work on v3.0 features through the `/v3.0/` path.