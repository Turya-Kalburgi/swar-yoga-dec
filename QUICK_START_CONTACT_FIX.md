# 🚀 Quick Start - Start Both Frontend & Backend

## The Issue (In 10 Seconds)

Your contact form tries to send to `http://localhost:3001` but **the backend server isn't running**.

**Solution**: Start the backend server in a separate terminal.

---

## ✅ Quick Fix (2 Minutes)

### Terminal 1: Start Frontend (if not already running)
```bash
cd /Users/mohankalburgi/Downloads/project\ 13
npm run dev

# Output:
# ➜  Local:   http://localhost:5173/
```

### Terminal 2: Start Backend
```bash
cd /Users/mohankalburgi/Downloads/project\ 13/server
npm run dev

# Output should show:
# ✅ MongoDB connected
# ✅ Server running on port 3001
```

### Terminal 3: (Optional) Check MongoDB
```bash
mongosh

# In MongoDB shell:
use swar-yoga
db.contacts.find().pretty()
```

---

## 🧪 Test It (30 Seconds)

1. Go to: **http://localhost:5173/contact**
2. Fill form:
   - Name: Test User
   - Email: test@123.com
   - Subject: Test
   - Message: Testing contact form
3. Click **"Send Message"**
4. See: ✅ **"Your message has been sent successfully!"**

---

## ✅ Verify Success

Check MongoDB terminal:
```bash
db.contacts.find().pretty()

# Should show your message:
# {
#   contactId: "uuid-here",
#   name: "Test User",
#   email: "test@123.com",
#   subject: "Test",
#   message: "Testing contact form",
#   status: "unread",
#   submittedAt: ISODate("..."),
#   ...
# }
```

---

## 🎯 What's Happening

```
Contact Form (Frontend)
   ↓ (fetch to http://localhost:3001/api/contact/messages)
Express Server (Backend) ← START THIS!
   ↓ (save to MongoDB)
MongoDB Contact Collection
   ↓
Admin sees message in dashboard
```

---

## 💾 Setup Checklist

- [ ] Terminal 1: `npm run dev` (Frontend on 5173)
- [ ] Terminal 2: `cd server && npm run dev` (Backend on 3001)
- [ ] Backend logs show "✅ MongoDB connected"
- [ ] Contact form works
- [ ] Message appears in MongoDB

---

## ⚠️ If Backend Won't Start

### Error: "Cannot find module 'mongoose'"
```bash
cd server
npm install
npm run dev
```

### Error: "MongoDB connection failed"
```bash
# Start MongoDB locally (macOS)
brew services start mongodb-community

# Or in Docker
docker run -d -p 27017:27017 mongo
```

### Error: "Port 3001 already in use"
```bash
# Find what's using port 3001
lsof -i :3001

# Kill it (replace 12345 with actual PID)
kill -9 12345
```

---

## 📋 File Locations

- Frontend: `/Users/mohankalburgi/Downloads/project\ 13`
- Backend: `/Users/mohankalburgi/Downloads/project\ 13/server`
- Config: `/Users/mohankalburgi/Downloads/project\ 13/.env.local`

---

**Done!** Contact form should now work perfectly. 🎉
