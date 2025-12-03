# Netlify Deployment Guide – Life Planner App

## Overview

This guide covers deploying the **Life Planner frontend** to Netlify and connecting it to a backend API server (running on your own infrastructure or a platform like Heroku, Railway, Render, etc.).

---

## Prerequisites

1. **GitHub Account** – Repository pushed to GitHub (already done)
2. **Netlify Account** – Sign up free at https://netlify.com
3. **Backend API Running** – Either:
   - Local dev server at http://localhost:4000 (for testing), OR
   - Deployed backend (e.g., Heroku, Railway, Render) at a public URL

---

## Option 1: Netlify Automated Deploy (Recommended)

### Step 1: Connect GitHub to Netlify

1. Go to **https://app.netlify.com** and sign in with your GitHub account (or create account).
2. Click **"Add new site"** → **"Import an existing project"**.
3. Select **GitHub** as the git provider.
4. Authorize Netlify to access your GitHub repos.
5. Search for and select `swaryoga-dec` (your Life Planner repo).
6. Click **"Deploy site"** (keep default settings for now, we'll customize next).

### Step 2: Configure Build Settings

When Netlify prompts for build settings, use these values:

| Field | Value |
|-------|-------|
| **Base directory** | (leave blank) |
| **Build command** | `npm run build` |
| **Publish directory** | `dist` |

Click **"Deploy"** to start the first build.

Netlify will:
- Fetch your repo from GitHub
- Run `npm install` (installs dependencies)
- Run `npm run build` (builds React app with Vite → outputs to `dist/`)
- Serve `dist/` as your live site

**Your site is live at:** `https://<random-name>.netlify.app` (or custom domain once configured)

### Step 3: Update API Endpoint for Production

Since your backend is separate, you need to tell the frontend where to reach it.

**Option A: Environment Variable (Recommended)**

1. In Netlify dashboard, go to **Site settings** → **Build & deploy** → **Environment**.
2. Click **"Edit variables"**.
3. Add a new variable:
   - **Key:** `VITE_API_BASE_URL`
   - **Value:** `https://your-backend-url.com` (e.g., `https://mylifeplanner-api.herokuapp.com`)
4. Re-deploy by triggering a new build (push a commit to main, or click **"Trigger deploy"** in Netlify).

Then, update `src/utils/database.ts` to read from this env var:

```typescript
// At the top of src/utils/database.ts
const API_BASE_URL = process.env.VITE_API_BASE_URL || '/api';
```

**Option B: Manually Update Code**

Edit `src/utils/database.ts` before pushing to GitHub:

```typescript
const API_BASE_URL = 'https://your-backend-url.com/api'; // Production backend
```

Then commit and push. Netlify will auto-rebuild and deploy.

### Step 4: Set Up Continuous Deployment

Netlify automatically deploys whenever you push to `main`:

```bash
git add .
git commit -m "Update API endpoint for production"
git push origin main
```

Netlify detects the push, builds, and deploys within ~2 minutes.

---

## Option 2: Manual Deploy (If Not Using GitHub Integration)

### Build Locally, Deploy Manually

```bash
# Build the production bundle
npm run build

# This creates dist/ folder with optimized React app

# Drag dist/ folder into Netlify dashboard "Deploy" area
# (Netlify UI allows drag-and-drop of folders)
```

---

## Backend Deployment Options

### Option A: Heroku (Simple, Free Tier Deprecated – Now Paid)

```bash
# Install Heroku CLI
brew tap heroku/brew && brew install heroku

# Login
heroku login

# Create app
heroku create mylifeplanner-api

# Deploy
git subtree push --prefix server heroku main
# (or configure GitHub deployment through Heroku dashboard)

# Check logs
heroku logs --tail

# App runs at: https://mylifeplanner-api.herokuapp.com
# Update VITE_API_BASE_URL in Netlify to this URL
```

### Option B: Railway (Recommended – Simple, Good Free Tier)

1. Go to **https://railway.app**
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select `swaryoga-dec` repo
5. Configure:
   - **Root directory:** `server`
   - **Start command:** `node server.js`
6. Add environment variables:
   - `PORT=4000` (or let Railway assign a port)
   - (Optional) `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` for production DB
7. Deploy
8. Railway assigns a public URL; update Netlify `VITE_API_BASE_URL` to this URL

### Option C: Render (Also Recommended)

1. Go to **https://render.com**
2. Sign up with GitHub
3. Click **"New Web Service"** → **"Build and deploy from a Git repository"**
4. Select `swaryoga-dec` repo
5. Configure:
   - **Environment:** Node
   - **Build command:** `cd server && npm install`
   - **Start command:** `cd server && node server.js`
   - **Root directory:** (leave blank or set to `server`)
6. Add environment variables (if needed)
7. Deploy
8. Copy the public URL; update Netlify `VITE_API_BASE_URL`

---

## Environment Variables Summary

### Frontend (Netlify)

| Variable | Value | Example |
|----------|-------|---------|
| `VITE_API_BASE_URL` | Your deployed backend URL | `https://mylifeplanner-api.railway.app` |

### Backend (Heroku/Railway/Render)

| Variable | Value | When to Use |
|----------|-------|-------------|
| `PORT` | Port number (default 4000) | Auto-assigned by platform usually |
| `SUPABASE_URL` | Your Supabase project URL | Optional; enables Postgres DB |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Optional; use with SUPABASE_URL |

---

## Testing the Deployment

1. **Frontend:** Open https://<your-netlify-site>.netlify.app/life-planner in browser
2. **Backend Health:** Open https://<your-backend-url>/api/health in browser
   - Should return `{ "ok": true, "time": <timestamp> }`
3. **Create Test Vision:** Use the frontend form to add a vision
   - Watch DevTools → Network tab → filter XHR
   - Confirm POST to `/api/visions` returns 200
4. **Verify Persistence:** Refresh page or navigate away/back
   - Vision list should still show your created item

---

## Troubleshooting

### Frontend Builds but Backend Calls Fail (404/Connection Refused)

**Cause:** `VITE_API_BASE_URL` not set or incorrect.

**Fix:**
1. In Netlify dashboard, confirm `VITE_API_BASE_URL` env var is set to correct backend URL.
2. Trigger a new deploy (or manually rebuild in Netlify).
3. Check browser DevTools → Console for any CORS/network errors.

### Backend Running but Frontend Doesn't Connect

**Cause:** CORS headers missing or backend URL unreachable.

**Fix:**
1. Verify backend is actually running: curl https://<backend-url>/api/health
2. Check backend logs for errors (use platform's log viewer: Heroku `heroku logs --tail`, Railway/Render dashboards).
3. Ensure backend has CORS enabled (already done in `server/server.js`).

### Build Fails on Netlify

**Cause:** Missing dependencies or build error.

**Fix:**
1. Check Netlify build logs (Netlify dashboard → "Deployments" → click failed deployment → view logs).
2. Run `npm run build` locally to reproduce:
   ```bash
   cd "/Users/mohankalburgi/Downloads/project 13"
   npm install
   npm run build
   ```
3. Fix local error, push to GitHub, and redeploy.

### Form Submissions Succeed but Data Doesn't Persist

**Cause:** Backend not actually running or using different storage.

**Fix:**
1. Check backend health: `curl https://<backend-url>/api/health`
2. If using Supabase, verify env vars are set and schema exists.
3. If using JSON file, check `server-data.json` is writable (backend running on Railway/Render may need persistent storage).

---

## Persistent Storage Options

### Option A: JSON File (Dev Only – Not Recommended for Production)

Currently, backend saves to `server-data.json` in the server directory. This works locally but:
- Not suitable for production (ephemeral containers, no data retention)
- Data lost if container restarts

### Option B: Supabase (Recommended for Production)

Supabase provides a managed PostgreSQL database:

1. Create free account: https://supabase.com
2. Create a new project (choose region closest to users)
3. In Supabase dashboard, get:
   - **Project URL** → `SUPABASE_URL`
   - **Service Role Key** (Settings → API) → `SUPABASE_SERVICE_ROLE_KEY`
4. In your backend platform (Railway/Render/Heroku), set env vars:
   ```
   SUPABASE_URL=https://xxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
   ```
5. Backend will auto-detect and use Supabase for visions, goals, tasks, todos, people, affirmations
6. JSON fallback active if Supabase unavailable

**Note:** Schema tables must exist in Supabase. See `server/SUPABASE_README.md` for setup.

---

## Custom Domain (Optional)

To use your own domain (e.g., https://lifeplanner.example.com):

### On Netlify
1. Go to **Site settings** → **Domain management** → **Add custom domain**
2. Enter your domain
3. Follow instructions to update DNS records (typically add CNAME or NS records at your domain registrar)
4. Netlify auto-provisions SSL certificate

### On Backend (if using separate domain)
- Similar process at platform (Railway, Render, Heroku)
- Update Netlify `VITE_API_BASE_URL` to new backend domain

---

## Summary of Steps

1. ✅ Push repo to GitHub (you've done this)
2. ✅ Connect GitHub to Netlify (auto-builds on push)
3. ✅ Deploy backend to Railway/Render/Heroku
4. ✅ Set `VITE_API_BASE_URL` env var in Netlify
5. ✅ Redeploy frontend (Netlify auto-rebuilds)
6. ✅ Open frontend at Netlify URL and test forms
7. ✅ (Optional) Set up custom domain
8. ✅ (Optional) Configure Supabase for persistent DB

---

## Support & Help

- **Netlify Docs:** https://docs.netlify.com
- **Netlify Community:** https://community.netlify.com
- **Railway Docs:** https://docs.railway.app
- **Render Docs:** https://render.com/docs
- **Supabase Docs:** https://supabase.com/docs

---

**Deployment Guide End**
