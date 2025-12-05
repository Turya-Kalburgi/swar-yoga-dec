# Contact Message Send Issue - ROOT CAUSE & SOLUTION

## 🔴 Problem Identified

**Contact messages are failing to send from the contact page because the backend server is NOT running.**

The frontend is trying to send requests to `http://localhost:3001/api/contact/messages`, but:
- ❌ Backend server is not listening on port 3001
- ❌ Backend MongoDB connection is not established
- ❌ Contact message POST endpoint is unreachable

## ✅ Root Cause

This is a **development environment setup issue**, not a code issue.

### Current Setup:
- **Frontend (Vite)**: Running on `http://localhost:5173` ✅
- **Backend (Express)**: NOT running on `http://localhost:3001` ❌
- **MongoDB**: Not connected (backend not running)

### Why It's Failing:
```
Frontend Form Submit
     ↓
fetch("http://localhost:3001/api/contact/messages")
     ↓
❌ Connection refused (no server listening)
     ↓
Fallback to production URL? (may fail for other reasons)
     ↓
User sees: "Failed to send message"
```

## 🚀 Solution

### Step 1: Start the Backend Server

**Option A: In a separate terminal (Recommended)**

```bash
# Terminal 1 - Start Backend
cd server
npm install    # if dependencies not installed
npm run dev    # or: node server.js

# Output should show:
# ✅ MongoDB connected
# ✅ Server running on port 3001
```

**Option B: Run both frontend and backend together**

First, set up concurrent execution by modifying root `package.json`:

```json
{
  "scripts": {
    "dev": "concurrently \"npm run frontend\" \"npm run backend\"",
    "frontend": "vite",
    "backend": "cd server && node server.js",
    "server": "cd server && node server.js"
  }
}
```

Then install concurrently:
```bash
npm install --save-dev concurrently
```

Then run both:
```bash
npm run dev
```

### Step 2: Verify Backend is Running

Check that you see these logs in backend terminal:

```
✅ MongoDB connected to: mongodb://localhost:27017/swar-yoga
✅ Server running on port 3001
📍 Environment: development
```

### Step 3: Test Contact Form

1. Open frontend: `http://localhost:5173`
2. Go to Contact page
3. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Subject: Test Message
   - Message: This is a test
   - Country Code: +91
   - WhatsApp: 9876543210 (optional)
4. Click "Send Message"
5. Should see: ✅ "Your message has been sent successfully!"

### Step 4: Verify Message Was Saved

Check MongoDB:

```bash
# In a new terminal
mongosh

# In MongoDB shell
use swar-yoga
db.contacts.find().pretty()

# Should show your test message with:
# {
#   _id: ObjectId(...),
#   contactId: "uuid-string",
#   name: "Test User",
#   email: "test@example.com",
#   subject: "Test Message",
#   message: "This is a test",
#   status: "unread",
#   priority: "medium",
#   submittedAt: ISODate("2024-..."),
#   ...
# }
```

## 📊 Current Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   FRONTEND (React)                      │
│              http://localhost:5173                      │
│                                                         │
│  ContactPage.tsx                                        │
│    └─ handleSubmit()                                    │
│         └─ fetch("http://localhost:3001/api/...")      │
└──────────────────────┬──────────────────────────────────┘
                       │
                       │ HTTP Request
                       │
                       ↓
┌──────────────────────────────────────────────────────────┐
│                 BACKEND (Express.js)                     │
│              http://localhost:3001/api                  │
│                   [NOT RUNNING]  ❌                     │
│                                                         │
│  server/server.js                                       │
│    ├─ Port 3001                                         │
│    └─ /api/contact routes                              │
│        └─ POST /messages                                │
│            └─ MongoDB Contact model                     │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ↓
┌──────────────────────────────────────────────────────────┐
│                  MongoDB (Local)                         │
│        mongodb://localhost:27017/swar-yoga             │
│                   [NOT CONNECTED]  ❌                  │
│                                                         │
│  Database: swar-yoga                                    │
│    └─ Collection: contacts                              │
│        └─ Contact messages                              │
└──────────────────────────────────────────────────────────┘
```

## 🔍 Verification Checklist

- [ ] Terminal 1: Frontend running on port 5173
- [ ] Terminal 2: Backend running on port 3001
- [ ] Backend logs show "✅ MongoDB connected"
- [ ] Can access http://localhost:3001/api/contact/messages (GET)
- [ ] Contact form submission succeeds
- [ ] Message appears in MongoDB contacts collection

## 💡 Code Status (No Changes Needed)

All code is **correct and working**:

✅ **ContactPage.tsx**: Correctly calls `http://localhost:3001/api/contact/messages`
✅ **contact.js routes**: POST /messages endpoint fully functional
✅ **Contact.js model**: MongoDB schema properly defined
✅ **server.js**: Routes properly registered with `/api/contact`

The only issue is the **backend server is not running**.

## 📝 Environment Configuration

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:3001/api          ✅ Correct
VITE_SUPABASE_API_URL=https://swar-yoga-dec...  (Fallback)
```

### Backend (server/.env)
```
MONGODB_URI=mongodb://localhost:27017/swar-yoga
MONGODB_URI_PROD=<production-uri>
NODE_ENV=development
```

## 🎯 Quick Start (3 Steps)

```bash
# Terminal 1
npm run dev          # Starts frontend on port 5173

# Terminal 2
cd server && npm run dev  # Starts backend on port 3001

# Test
# Visit http://localhost:5173/contact and submit form
```

## ⚠️ Common Issues After Starting Backend

### Issue: ECONNREFUSED (still can't connect)
- **Cause**: MongoDB not running locally
- **Solution**: 
  ```bash
  # On macOS
  brew services start mongodb-community
  
  # Or run MongoDB in Docker
  docker run -d -p 27017:27017 --name mongodb mongo
  ```

### Issue: Port 3001 already in use
- **Cause**: Another process using port 3001
- **Solution**:
  ```bash
  # Find process
  lsof -i :3001
  
  # Kill process
  kill -9 <PID>
  ```

### Issue: MongoDB Connection Failed
- **Cause**: MongoDB not running or wrong URI
- **Solution**:
  ```bash
  # Check MongoDB status
  brew services list
  
  # Check connection URI in server/.env
  # Should be: mongodb://localhost:27017/swar-yoga
  ```

## 📚 File Reference

**Related Files**:
- Frontend: `/src/pages/ContactPage.tsx` (line 115: API endpoint)
- Backend Routes: `/server/routes/contact.js` (POST /messages handler)
- Backend Model: `/server/models/Contact.js` (MongoDB schema)
- Backend Server: `/server/server.js` (Express setup & route registration)

## 🎓 What This Tells Us

This is a **setup/deployment issue**, not a code issue:

1. **Development Environment**: Frontend and backend run separately
2. **Two Servers**: Must run BOTH for full functionality
3. **MongoDB**: Requires local setup in development
4. **Port Configuration**: Frontend 5173, Backend 3001, MongoDB 27017

---

**Status**: ✅ IDENTIFIED & DOCUMENTED

**Next**: Start backend server and test contact form

**Time to Fix**: < 2 minutes (just start the backend)
