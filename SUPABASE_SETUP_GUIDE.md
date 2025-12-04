# 🔧 SUPABASE INTEGRATION SETUP

## 📍 Your Supabase Project
```
Project Name: swar-yoga-admin
URL: https://swar-yoga-admin.supabase.co
Status: Ready for integration
```

---

## 🚀 INTEGRATION STEPS

### Step 1: Create `.env.local` File
**Location**: Project root (same level as package.json)

```
VITE_SUPABASE_URL=https://swar-yoga-admin.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 2: Find Your Keys in Supabase
1. Go to: https://app.supabase.com
2. Select project: `swar-yoga-admin`
3. Go to: Settings → API
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** → `VITE_SUPABASE_ANON_KEY`

### Step 3: Install Supabase Client
```bash
npm install @supabase/supabase-js
```

### Step 4: Create Supabase Configuration File
See: `src/config/supabase.ts` (we'll create this)

### Step 5: Update API Calls
Replace `localhost:4000` with Supabase API

### Step 6: Deploy to Vercel
Add environment variables to Vercel dashboard

---

## 📋 NEXT: What You Need to Tell Me

To complete the integration, I need to know:

```
1. Database Tables
   - What tables do you have in Supabase?
   - Example: workshops, users, cart, orders

2. Table Structure
   - What columns in each table?
   - Example: workshops has (id, title, price, instructor)

3. Authentication
   - Using Supabase Auth?
   - Email/password login?
   - Social auth?

4. Current APIs
   - Which endpoints does your app use?
   - From server/server.js
   - What does each endpoint do?

5. Real-time Features
   - Need real-time updates?
   - For chat? notifications? data sync?
```

---

## 🎯 What I Can Create

Once you provide the above:

✅ **Supabase Client Configuration**
- `src/config/supabase.ts`
- Proper initialization
- Environment variables setup

✅ **API Integration Layer**
- Replace localhost with Supabase API
- Proper error handling
- Type safety with TypeScript

✅ **Authentication Setup**
- Login/signup with Supabase Auth
- Protected routes
- Session management

✅ **Database Integration**
- Workshop CRUD operations
- User management
- Cart operations
- Data validation

✅ **Environment Configuration**
- `.env.local` template
- `.env.example` for GitHub
- Vercel secrets configuration

---

## ⚠️ SECURITY REMINDERS

✅ **Safe to Share:**
- Supabase Project URL
- Project name
- Table names & structure

❌ **Never Share:**
- API keys (anon or service role)
- Passwords
- Tokens
- Database passwords

✅ **How to Store:**
- `.env.local` (development only)
- Add to `.gitignore`
- Vercel environment variables (for production)

---

## 📝 Example Structure

When you tell me your database structure, format like this:

```
TABLE: workshops
├── id (UUID, primary key)
├── title (text)
├── price_inr (number)
├── price_npr (number)
├── price_usd (number)
├── instructor (text)
├── start_date (date)
├── end_date (date)
├── image (text - URL)
├── is_public (boolean)
└── created_at (timestamp)

TABLE: users
├── id (UUID, primary key)
├── email (text)
├── name (text)
├── created_at (timestamp)
└── updated_at (timestamp)

TABLE: cart
├── id (UUID, primary key)
├── user_id (UUID, FK to users)
├── workshop_id (UUID, FK to workshops)
├── quantity (number)
└── added_at (timestamp)
```

---

## 🎊 What Happens Next

1. **You provide** database structure
2. **I create** Supabase integration code
3. **I create** API wrapper functions
4. **You add** environment variables
5. **We test** everything locally
6. **Deploy** to Vercel with secrets
7. **Your site** fully functional! ✅

---

**Please share your database table structure!** 🚀

