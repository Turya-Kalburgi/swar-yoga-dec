# 🚀 Auto-Start Server Guide

**Project:** Swar Yoga - Sadhaka Planner  
**Date:** December 6, 2025  
**Status:** ✅ Auto-start configured

---

## 📋 Quick Start

### Start Everything (Both Servers)
```bash
./start-all.sh
```

### Start Backend Only
```bash
./start-backend.sh
```

### Start Frontend Only
```bash
./start-frontend.sh
```

---

## 🎯 What Each Script Does

### `start-all.sh` - Complete Application
**Starts:** Frontend + Backend (MongoDB Atlas)

✅ Kills any existing processes on ports 3001, 5173  
✅ Installs dependencies if needed  
✅ Starts Express backend on http://localhost:3001  
✅ Starts Vite frontend on http://localhost:5173  
✅ Connects to MongoDB Atlas automatically  
✅ Provides colored output with PIDs  
✅ Graceful shutdown on Ctrl+C  

**Use when:** You want to run the complete application locally

---

### `start-backend.sh` - Backend Only
**Starts:** Express Server (http://localhost:3001)

✅ Cleans up port 3001  
✅ Installs dependencies if needed  
✅ Runs backend development server  
✅ Connects to MongoDB Atlas  
✅ Auto-restarts on code changes (tsx watch)

**Use when:** 
- You want backend development only
- Frontend is deployed on Vercel/Netlify
- Testing API endpoints

---

### `start-frontend.sh` - Frontend Only
**Starts:** Vite Dev Server (http://localhost:5173)

✅ Cleans up port 5173  
✅ Installs dependencies if needed  
✅ Runs Vite development server  
✅ Connects to backend (http://localhost:3001/api)  
✅ Hot module replacement (HMR)

**Use when:**
- Backend is running on different machine
- You're working on UI only
- Testing frontend with production API

---

## 📍 Endpoints

### When Running `start-all.sh`

| Component | URL | Purpose |
|-----------|-----|---------|
| Frontend | http://localhost:5173 | React UI |
| Backend | http://localhost:3001 | API Server |
| API | http://localhost:3001/api | REST Endpoints |
| Database | MongoDB Atlas | Data Storage |

### Health Check
```bash
# Frontend
curl http://localhost:5173

# Backend
curl http://localhost:3001

# API Health
curl http://localhost:3001/api/health
```

---

## 🔧 Prerequisites

### Required
- ✅ Node.js v18+ (check: `node --version`)
- ✅ npm (comes with Node.js)
- ✅ MongoDB Atlas account with credentials
- ✅ Internet connection (for MongoDB Atlas)

### Optional
- Git (for version control)
- VS Code (for development)

---

## 📊 Server Configuration

### Backend (Express)
**Port:** 3001  
**Environment:** `NODE_ENV=development`  
**Database:** MongoDB Atlas (via `server/.env`)  
**Start Script:** `npm run dev` (uses tsx watch)

### Frontend (Vite)
**Port:** 5173  
**Framework:** React 18 + TypeScript  
**API Proxy:** http://localhost:3001 (dev only)  
**Start Script:** `npm run dev`

---

## ⚙️ Configuration Files

### `/server/.env`
```bash
# MongoDB Connection
MONGODB_URI=mongodb+srv://...@swaryogadb.../swar-yoga-db

# Server Config
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

### `/.env.local` (Frontend)
```bash
# API Configuration
VITE_API_URL=http://localhost:3001/api

# Feature Flags
VITE_ENABLE_MONGODB=true
```

---

## 🎨 Output Example

### When running `start-all.sh`
```
════════════════════════════════════════════════════════════
🚀 SWAR YOGA - COMPLETE APPLICATION STARTER
════════════════════════════════════════════════════════════

✅ Node.js found: v20.11.0

🔄 Cleaning up any existing processes...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 Starting Backend Server (Express + MongoDB Atlas)...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Backend server started (PID: 12345)
   📍 Server: http://localhost:3001
   🗄️  Database: MongoDB Atlas

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚛️  Starting Frontend Server (Vite + React)...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Frontend server started (PID: 12346)
   📍 Server: http://localhost:5173
   ⚛️  Framework: React + TypeScript + Vite

════════════════════════════════════════════════════════════
✅ BOTH SERVERS STARTED SUCCESSFULLY!
════════════════════════════════════════════════════════════

🌐 Access your application:
   Frontend: http://localhost:5173
   Backend:  http://localhost:3001
   API:      http://localhost:3001/api

📊 Monitoring:
   Backend PID:  12345
   Frontend PID: 12346

🛑 To stop all servers:
   Press Ctrl+C

════════════════════════════════════════════════════════════
```

---

## 🚨 Troubleshooting

### "Port 3001 already in use"
```bash
# Find and kill process on port 3001
lsof -i :3001
kill -9 <PID>

# Or use the script (handles this automatically)
./start-all.sh
```

### "Port 5173 already in use"
```bash
# Find and kill process on port 5173
lsof -i :5173
kill -9 <PID>

# Or restart the script
./start-all.sh
```

### "MongoDB connection failed"
```
❌ Error: bad auth : Authentication failed

Fix:
1. Check MONGODB_URI in server/.env
2. Verify IP whitelist in MongoDB Atlas
3. Test connection: mongosh "mongodb+srv://..."
4. Ensure internet connection is active
```

### "npm command not found"
```bash
# Install Node.js from https://nodejs.org/
# Then restart terminal
node --version
npm --version
```

### "Dependencies missing"
```bash
# The scripts auto-install, but if needed:
npm install
cd server && npm install
```

---

## 📈 Logs & Debugging

### View Backend Logs
```bash
# Logs appear in same terminal as ./start-backend.sh
# Look for: "✅ MongoDB Connected:"
```

### View Frontend Logs
```bash
# Logs appear in same terminal as ./start-frontend.sh
# Look for: "VITE v5.x.x  ready in xxx ms"
```

### Enable Debug Mode
```bash
# Backend debug (in new terminal)
DEBUG=* npm run dev

# Frontend debug  
DEBUG=vite:* npm run dev
```

---

## 🔐 Security Notes

### Development
✅ Passwords visible in console (expected)  
✅ CORS allowed from localhost  
✅ No SSL/TLS enforced (local only)

### Production
❌ Never share `.env` files  
❌ Always use environment variables  
❌ Enable HTTPS/TLS  
❌ Restrict CORS to your domain

---

## 📦 Package Scripts

### Backend (`server/package.json`)
```bash
npm run start      # Production: node dist/server.js
npm run dev        # Development: tsx watch server.ts
npm run build      # Compile: tsc
npm run start:ts   # TypeScript: tsx server.ts
```

### Frontend (`package.json`)
```bash
npm run dev        # Development server (Vite)
npm run build      # Build for production
npm run preview    # Preview build locally
npm run lint       # Run ESLint
```

---

## 🎯 Workflow Examples

### Example 1: Full Stack Development
```bash
# Terminal 1: Backend
./start-backend.sh

# Terminal 2: Frontend
./start-frontend.sh

# Then:
# - Edit backend code → auto-reload via tsx
# - Edit frontend code → hot reload via Vite
# - Open http://localhost:5173
```

### Example 2: Quick Test
```bash
# All in one terminal
./start-all.sh

# Wait for startup
# Open http://localhost:5173
# Test functionality
# Press Ctrl+C to stop both
```

### Example 3: API Testing
```bash
# Terminal 1
./start-backend.sh

# Terminal 2: Test API
curl http://localhost:3001/api/health

# Or use Postman/Insomnia
# Import: http://localhost:3001/api
```

---

## 🌍 Connecting to MongoDB Atlas

### Setup (if not already done)
1. Go to MongoDB Atlas: https://www.mongodb.com/cloud/atlas
2. Create cluster: swaryogadb
3. Create user credentials
4. Get connection string
5. Add IP to whitelist
6. Update `server/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/swar-yoga-db
   ```

### Verify Connection
```bash
# Backend logs should show:
✅ MongoDB Connected: cluster0.dheqmu1.mongodb.net
```

---

## 📝 Auto-Start on System Boot

### macOS (using launchd)
1. Create file: `~/Library/LaunchAgents/com.swaryoga.app.plist`
2. Add startup script
3. Load: `launchctl load ~/Library/LaunchAgents/com.swaryoga.app.plist`

### Linux (using systemd)
1. Create service: `/etc/systemd/system/swaryoga.service`
2. Enable: `sudo systemctl enable swaryoga`
3. Start: `sudo systemctl start swaryoga`

### Windows (using Task Scheduler)
1. Create new task
2. Action: Start program → `C:\path\to\start-all.sh`
3. Set to run at startup

---

## 🎯 Next Steps

### For Development
1. Run: `./start-all.sh`
2. Open: http://localhost:5173
3. Edit code
4. Changes auto-reload
5. Test functionality

### For Deployment
1. Backend: Deploy to hosting (Railway, AWS, etc.)
2. Frontend: Deploy to Vercel/Netlify
3. Set environment variables
4. Update API URLs
5. Test production

---

## ✅ Verification Checklist

- [x] Scripts created and executable
- [x] Backend auto-starts on port 3001
- [x] Frontend auto-starts on port 5173
- [x] MongoDB Atlas connection configured
- [x] Environment variables set
- [x] Graceful shutdown on Ctrl+C
- [x] Auto-dependency installation
- [x] Port cleanup on startup

---

## 💡 Tips & Tricks

### Faster Startup
```bash
# Skip dependency check if already installed
# Comment out the npm install check in scripts
```

### Keep Logs
```bash
# Save logs to file
./start-all.sh > app.log 2>&1 &
tail -f app.log
```

### Separate Terminals
```bash
# Terminal 1
./start-backend.sh

# Terminal 2
./start-frontend.sh

# Terminal 3
# Can still use for testing/commands
```

### Monitor Process
```bash
# In another terminal, watch processes
watch -n 1 'lsof -i :3001,5173'
```

---

## 📞 Support

**Database Issues:** Check MongoDB Atlas IP whitelist  
**Port Issues:** Use `lsof -i :PORT` to find conflicts  
**Dependencies:** Run `npm install` in both directories  
**Backend Issues:** Check `server/.env` for MONGODB_URI  
**Frontend Issues:** Check `VITE_API_URL` in `.env.local`  

---

**Status: ✅ Auto-Start Configured & Ready**

Both servers can now auto-start with simple commands! 🎉

