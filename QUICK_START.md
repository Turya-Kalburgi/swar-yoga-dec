# ⚡ Quick Start Reference

## 🚀 Start All Servers (Frontend + Backend)
```bash
./start-all.sh
```
- ✅ Starts backend on http://localhost:3001
- ✅ Starts frontend on http://localhost:5173
- ✅ Connects to MongoDB Atlas automatically
- ✅ Kills existing processes on ports
- ✅ Auto-installs dependencies
- ✅ Press Ctrl+C to stop both

---

## 📦 Start Backend Only
```bash
./start-backend.sh
```
- Port: http://localhost:3001
- Database: MongoDB Atlas
- Auto-reloads on code changes

---

## ⚛️ Start Frontend Only
```bash
./start-frontend.sh
```
- Port: http://localhost:5173
- Framework: React + Vite
- Hot module replacement enabled

---

## 🌐 Access Points

| Component | URL |
|-----------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:3001 |
| API | http://localhost:3001/api |
| Health | http://localhost:3001/api/health |

---

## 🔍 Check Servers Status

```bash
# Frontend
curl http://localhost:5173

# Backend
curl http://localhost:3001

# API Health
curl http://localhost:3001/api/health
```

---

## 🛑 Stop Servers

Press **Ctrl+C** in the terminal running the server

---

## 🔧 Common Issues

### Port Already in Use
```bash
# Kill process on port 3001
lsof -i :3001 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill process on port 5173
lsof -i :5173 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### MongoDB Connection Failed
1. Check `server/.env` has correct MONGODB_URI
2. Verify IP is whitelisted in MongoDB Atlas
3. Ensure internet connection is active

### Dependencies Missing
```bash
# Frontend dependencies
npm install

# Backend dependencies
cd server && npm install
```

---

## 📊 Server Details

### Backend (Port 3001)
- Framework: Express.js
- Language: TypeScript
- Database: MongoDB Atlas
- Auto-reload: tsx watch
- Endpoints: 50+ REST APIs

### Frontend (Port 5173)
- Framework: React 18
- Language: TypeScript
- Build: Vite
- Hot Reload: Yes (HMR)
- UI Components: Tailwind CSS + Lucide Icons

---

## 🗂️ Project Structure

```
project-13/
├── start-all.sh           # Start both servers
├── start-backend.sh       # Backend only
├── start-frontend.sh      # Frontend only
├── server/
│   ├── package.json       # Backend dependencies
│   ├── .env              # MongoDB connection
│   ├── server.ts         # Express app
│   ├── config/
│   │   └── db.ts         # MongoDB connection
│   ├── routes/           # API endpoints
│   ├── models/           # MongoDB models
│   └── ...
├── src/                  # Frontend React code
├── package.json          # Frontend dependencies
├── .env.local           # Frontend config
└── vite.config.ts       # Vite configuration
```

---

## 🚀 Development Workflow

### Step 1: Start Servers
```bash
./start-all.sh
```

### Step 2: Open Browser
```
http://localhost:5173
```

### Step 3: Make Changes
- Edit React components → Auto-reload
- Edit backend code → Auto-reload
- Check console for errors

### Step 4: Test
- Test UI interactions
- Check browser console
- Monitor backend logs

### Step 5: Stop
```
Press Ctrl+C
```

---

## 📈 Next Steps

**For Development:**
1. Run `./start-all.sh`
2. Edit code
3. See changes instantly
4. Test functionality

**For Production:**
1. Deploy backend to hosting
2. Deploy frontend to Vercel
3. Set environment variables
4. Update API URLs

---

## ✅ Everything Works When

- ✅ Backend starts on port 3001
- ✅ Frontend starts on port 5173
- ✅ No error messages in logs
- ✅ MongoDB Atlas connected
- ✅ Can access http://localhost:5173
- ✅ API responds at http://localhost:3001/api

---

## 💡 Pro Tips

1. **Use multiple terminals**: Keep backend and frontend in separate terminals
2. **Watch the logs**: Important errors appear in startup logs
3. **Check ports first**: Use `lsof -i :3001` and `lsof -i :5173`
4. **MongoDB Atlas**: Ensure IP is whitelisted for your connection
5. **Keep .env updated**: Change MONGODB_URI if credentials change

---

**Ready to develop? Run: `./start-all.sh` 🚀**

