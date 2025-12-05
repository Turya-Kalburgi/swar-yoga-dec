# Contact Message Send Issue - Complete Analysis & Solution

## 📌 Summary

**Issue**: Contact form messages not sending from the frontend
**Root Cause**: Backend Express.js server is not running on port 3001
**Status**: ✅ DIAGNOSED & SOLUTION PROVIDED
**Time to Fix**: 2 minutes (start backend server)

---

## 🔍 What We Found

### The Real Problem

The frontend (Vite on port 5173) is attempting to send contact messages to the backend API at:
```
http://localhost:3001/api/contact/messages
```

However, **there is no server listening on port 3001** because the backend Express server hasn't been started.

### Why Messages Fail

```
Flow:
1. User fills contact form on http://localhost:5173/contact
2. User clicks "Send Message"
3. Frontend code executes:
   fetch("http://localhost:3001/api/contact/messages", { ... })
4. Browser tries to connect to localhost:3001
5. ❌ No server listening → Connection refused
6. Error thrown: "Failed to send message"
7. User sees error toast notification
```

### Evidence

When we tested the endpoint:
```bash
$ curl -X POST http://localhost:3001/api/contact/messages \
  -H "Content-Type: application/json" \
  -d '{"name":"Test", ...}'

❌ curl: (7) Failed to connect to localhost port 3001: Couldn't connect to server
```

This confirms: **No server on port 3001**

---

## ✅ The Solution

### Start the Backend Server

This is a **development environment configuration**, not a code bug.

**Three Options**:

#### Option 1: Simple - Two Terminal Windows (Easiest)

**Terminal 1 - Frontend:**
```bash
cd /Users/mohankalburgi/Downloads/project\ 13
npm run dev
# Output: ➜  Local:   http://localhost:5173/
```

**Terminal 2 - Backend:**
```bash
cd /Users/mohankalburgi/Downloads/project\ 13/server
npm run dev
# Output: ✅ Server running on port 3001
```

**Terminal 3 (Optional) - MongoDB Check:**
```bash
mongosh
use swar-yoga
db.contacts.find().pretty()
```

---

#### Option 2: Concurrently - Single Terminal

Modify `/Users/mohankalburgi/Downloads/project\ 13/package.json`:

```json
{
  "scripts": {
    "dev": "concurrently \"vite\" \"cd server && node server.js\"",
    "frontend": "vite",
    "backend": "cd server && node server.js",
    "server": "cd server && node server.js"
  }
}
```

Install concurrently:
```bash
npm install --save-dev concurrently
```

Run both:
```bash
npm run dev
```

---

#### Option 3: Forever/PM2 - Production-Like

```bash
# Install pm2 globally
npm install -g pm2

# Start backend with PM2
pm2 start server/server.js --name "swar-backend"

# Start frontend
npm run dev

# Check status
pm2 list
pm2 logs swar-backend
```

---

## 🧪 Verification Steps

### Step 1: Confirm Backend Running
```bash
# Should see output like:
# ✅ MongoDB connected to: mongodb://localhost:27017/swar-yoga
# ✅ Server running on port 3001
# 📍 Environment: development
```

### Step 2: Test Endpoint Directly
```bash
curl -X GET http://localhost:3001/api/contact/messages
# Should return: { success: true, data: [], pagination: {...} }
```

### Step 3: Test Contact Form
1. Navigate to: http://localhost:5173/contact
2. Fill out form with test data
3. Click "Send Message"
4. See success message: ✅ "Your message has been sent successfully!"

### Step 4: Verify in MongoDB
```bash
mongosh
use swar-yoga
db.contacts.findOne({email: "your-test-email@example.com"})

# Should show your message with all fields
```

---

## 🏗️ Architecture Overview

### Current Setup

```
┌─────────────────────────────────────────────────────────────┐
│                    Your Machine                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Port 5173                                                  │
│  ┌──────────────────┐                                       │
│  │  Frontend (Vite) │  ← npm run dev                       │
│  │  React + TS      │  ✅ RUNNING                          │
│  │  http://...5173  │                                       │
│  └────────┬─────────┘                                       │
│           │                                                 │
│           │ fetch("localhost:3001/api/contact/messages")   │
│           │                                                 │
│  ┌────────▼─────────┐                                       │
│  │Backend (Express) │  ← cd server && npm run dev         │
│  │Node.js + MongoDB │  ❌ NOT RUNNING                     │
│  │Port 3001         │  (This is the problem!)              │
│  │(listening?)      │                                       │
│  └────────┬─────────┘                                       │
│           │                                                 │
│           │ save message                                    │
│           │                                                 │
│  ┌────────▼─────────────────┐                              │
│  │  MongoDB                 │                              │
│  │  localhost:27017         │                              │
│  │  Database: swar-yoga     │                              │
│  │  Collection: contacts    │                              │
│  └──────────────────────────┘                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### What's Missing?

The **Express backend server** needs to be running to:
1. Receive the POST request from frontend
2. Validate the contact message
3. Check for duplicates (60-second cooldown)
4. Save to MongoDB
5. Return success response

Without it → Connection refused → Error

---

## 🔧 Configuration Check

### Frontend Configuration ✅
**File**: `/Users/mohankalburgi/Downloads/project\ 13/.env.local`

```bash
VITE_API_URL=http://localhost:3001/api    ← Correct for dev
VITE_SUPABASE_API_URL=https://swar-yoga-dec.onrender.com  (fallback)
```

✅ **Status**: Correctly configured for localhost development

### Backend Configuration ✅
**File**: `/Users/mohankalburgi/Downloads/project\ 13/server/server.js`

```javascript
// Line 84
app.use('/api/contact', contactRoutes);  ← Route registered
```

✅ **Status**: Route properly configured

### MongoDB Configuration ✅
**File**: `/Users/mohankalburgi/Downloads/project\ 13/server/.env`

```
MONGODB_URI=mongodb://localhost:27017/swar-yoga
```

✅ **Status**: Configured for local MongoDB

---

## 📝 Contact API Details

### Endpoint: POST /api/contact/messages

**Frontend Call** (in ContactPage.tsx):
```typescript
const response = await fetch(`${API_URL}/contact/messages`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: formData.name,           // Required
    email: formData.email,         // Required
    subject: formData.subject,     // Required
    message: formData.message,     // Required
    countryCode: formData.countryCode,  // Optional, default: +91
    whatsapp: formData.whatsapp    // Optional
  })
});
```

**Backend Handler** (in server/routes/contact.js):
```javascript
router.post('/messages', async (req, res) => {
  // 1. Validate required fields
  // 2. Check for duplicates (same email + subject within 60 seconds)
  // 3. Create new Contact document
  // 4. Save to MongoDB
  // 5. Return success with contactId
});
```

**MongoDB Document**:
```javascript
{
  _id: ObjectId(...),
  contactId: "uuid-string",
  name: "User Name",
  email: "user@email.com",
  countryCode: "+91",
  whatsapp: "9876543210",
  subject: "Subject Line",
  message: "Message body",
  status: "unread",              // Can be: unread, read, replied, closed
  priority: "medium",            // Can be: low, medium, high
  ipAddress: "192.168.x.x",
  userAgent: "Mozilla/5.0...",
  submittedAt: ISODate("2024-..."),
  repliedAt: null,
  replyMessage: null,
  assignedTo: null,
  metadata: { device: "web", browser: "Chrome" }
}
```

---

## 🚨 Troubleshooting

### Issue 1: "Connection Refused"
```
Error: Failed to send message (from contact page)
curl: (7) Failed to connect to localhost port 3001
```

**Cause**: Backend server not running
**Fix**: 
```bash
cd server && npm run dev
```

---

### Issue 2: "Cannot find module 'mongoose'"
```
Error: Cannot find module 'mongoose'
```

**Cause**: Backend dependencies not installed
**Fix**:
```bash
cd server
npm install
npm run dev
```

---

### Issue 3: "MongoDB connection failed"
```
❌ MongoDB connection failed: connect ECONNREFUSED
```

**Cause**: MongoDB service not running locally
**Fix (macOS)**:
```bash
brew services start mongodb-community
# Or check status
brew services list | grep mongo
```

**Fix (Docker)**:
```bash
docker run -d -p 27017:27017 --name mongodb mongo
```

---

### Issue 4: "Port 3001 already in use"
```
EADDRINUSE: address already in use :::3001
```

**Cause**: Another process using port 3001
**Fix**:
```bash
lsof -i :3001      # Find the process
kill -9 <PID>      # Kill it (replace PID with actual number)
cd server && npm run dev  # Start server again
```

---

### Issue 5: "Duplicate message detected"
```
Error: Duplicate message detected. Please wait before sending again.
```

**Cause**: Same email + subject sent within 60 seconds (anti-spam)
**Fix**: Either:
- Use different email address
- Use different subject
- Wait 60+ seconds
- Use different message content

---

## 📊 Request/Response Examples

### Successful Send

**Request:**
```bash
curl -X POST http://localhost:3001/api/contact/messages \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Hello",
    "message": "This is a test message",
    "countryCode": "+91",
    "whatsapp": "9876543210"
  }'
```

**Response (201):**
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "contactId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@example.com",
    "subject": "Hello",
    "submittedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Failed Send (Backend Not Running)

**Request:**
```bash
curl -X POST http://localhost:3001/api/contact/messages ...
```

**Error:**
```
curl: (7) Failed to connect to localhost port 3001 after 0 ms: Couldn't connect to server
```

---

## 💡 Key Insights

1. **Frontend ≠ Backend**: They're separate services that must both run
2. **Development Setup**: Requires manual startup of backend
3. **Environment Variables**: Already correctly configured in `.env.local`
4. **No Code Changes Needed**: Just start the backend server
5. **MongoDB Local**: Required for development (not production)

---

## 🎯 Summary of What's Needed

| Component | Status | What to Do |
|-----------|--------|-----------|
| Frontend (Vite) | ✅ Running | Already working on port 5173 |
| Backend (Express) | ❌ Not Running | **Start: `cd server && npm run dev`** |
| MongoDB | ? Unclear | **Check: `brew services list`** |
| Code | ✅ Correct | No changes needed |
| Configuration | ✅ Correct | `.env.local` is properly set |

---

## ✨ Next Steps

1. **Start Backend**:
   ```bash
   cd /Users/mohankalburgi/Downloads/project\ 13/server
   npm run dev
   ```

2. **Test Contact Form**:
   - Go to http://localhost:5173/contact
   - Fill and submit form
   - Should see success message

3. **Verify in MongoDB**:
   ```bash
   mongosh
   use swar-yoga
   db.contacts.find().pretty()
   ```

That's it! 🎉

---

**Documentation**: `/Users/mohankalburgi/Downloads/project\ 13/CONTACT_MESSAGE_SEND_ISSUE_RESOLVED.md`

**Quick Start**: `/Users/mohankalburgi/Downloads/project\ 13/QUICK_START_CONTACT_FIX.md`
