# 🔧 Daily Plan, Health, Reminders - Form Submission & Data Persistence Fix

## Problem Summary

Forms for **Daily Plan, Health Tracker, and Reminders** are not submitting on Netlify (swaryoga.online) and data is not being saved to MongoDB.

**Root Cause:** The frontend is trying to reach a backend API that is returning 502 errors.

---

## Issues Identified

### 1. **Hardcoded Backend URL (Fixed ✅)**

**Before:**
```typescript
// database.ts - OLD
const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:3001/api'
  : 'https://swar-yoga-dec.onrender.com/api';  // ❌ This is returning 502 errors
```

**After:**
```typescript
// database.ts - NEW
const API_BASE_URL = (() => {
  // Priority: env variable > localhost detection > fallback URL
  if ((import.meta as any).env.VITE_API_URL) {
    return (import.meta as any).env.VITE_API_URL;
  }
  
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:3001/api';
  }
  
  const fallback = (import.meta as any).env.VITE_PRODUCTION_API_URL || 'https://api.swaryoga.online';
  return fallback;
})();
```

### 2. **Missing Environment Variables (Partially Fixed)**

Created `.env.production` file with:
```bash
VITE_API_URL=https://api.swaryoga.online/api
VITE_PRODUCTION_API_URL=https://api.swaryoga.online/api
```

---

## ⚠️ What You Need To Do

### Step 1: Determine Your Backend API URL

You mentioned deploying on Netlify with **swaryoga.online** domain. You need to tell me:

**What is your backend API server running at?**

Options:
- [ ] A. `https://api.swaryoga.online/api` (separate subdomain)
- [ ] B. `https://swaryoga.online/api` (same domain)
- [ ] C. A different URL (e.g., Heroku, Railway, Render, etc.)
- [ ] D. Not deployed yet (need to deploy backend)

### Step 2: Configure the Backend URL

Once you know your backend URL, update the `.env.production` file:

```bash
# In .env.production, line 4 - UPDATE THIS:
VITE_API_URL=YOUR_ACTUAL_BACKEND_URL_HERE
VITE_PRODUCTION_API_URL=YOUR_ACTUAL_BACKEND_URL_HERE
```

### Step 3: Set Environment Variables in Netlify Dashboard

1. Go to **Netlify Dashboard** → Your Site → **Build & Deploy** → **Environment**
2. Add these environment variables:
   ```
   VITE_API_URL = <your-backend-url>
   VITE_PRODUCTION_API_URL = <your-backend-url>
   ```
3. Trigger a rebuild: **Deploys** → **Trigger Deploy** → **Deploy Site**

### Step 4: Verify Backend is Running

Test your backend API manually:
```bash
curl -X GET "https://api.swaryoga.online/api/dailyplans?userId=test-user"
```

Expected response should not be a 502 error.

---

## 🧪 Testing After Fix

### Local Testing (Localhost)
```bash
# Terminal 1: Start backend
cd server && npm start  # Runs on http://localhost:3001

# Terminal 2: Start frontend
npm run dev  # Runs on http://localhost:5173
```

Then test:
1. Go to **Daily Plan** section
2. Click "Add Activity"
3. Fill form and click "Create"
4. Verify data appears below the form

### Production Testing (Netlify)
1. Go to https://swaryoga.online
2. Go to **Daily Plan** section
3. Add an activity
4. Form should submit successfully
5. Activity should display immediately

---

## 📁 Files Changed

- ✅ `/src/utils/database.ts` - Updated to use environment variables
- ✅ `/.env.production` - Created with API URL placeholders

## 📋 Backend Requirements

Your backend needs these MongoDB collections and API endpoints:

### Collections:
- `dailyplans` - For Daily Plan activities
- `healthtrackers` - For Health Tracker entries
- `reminders` - For Reminder entries

### API Endpoints Required:
```
POST   /api/dailyplans          - Create daily plan
GET    /api/dailyplans          - Get all daily plans
GET    /api/dailyplans/:id      - Get single daily plan
PUT    /api/dailyplans/:id      - Update daily plan
DELETE /api/dailyplans/:id      - Delete daily plan

POST   /api/healthtrackers      - Create health entry
GET    /api/healthtrackers      - Get all health entries
PUT    /api/healthtrackers/:id  - Update health entry
DELETE /api/healthtrackers/:id  - Delete health entry

POST   /api/reminders           - Create reminder
GET    /api/reminders           - Get all reminders
PUT    /api/reminders/:id       - Update reminder
DELETE /api/reminders/:id       - Delete reminder
```

All endpoints should accept `userId` in the request body or headers.

---

## Next Steps

1. **Tell me your backend URL** - This is critical!
2. Update the environment variables in `.env.production`
3. Set environment variables in Netlify Dashboard
4. Trigger a rebuild
5. Test the forms

Once you provide your backend URL, I can verify everything is configured correctly and test the end-to-end flow.

---

## Additional Resources

- Netlify Environment Variables: https://docs.netlify.com/configure-builds/environment-variables/
- How to deploy a Node.js backend: Check your hosting provider docs (Railway, Render, Heroku, etc.)
