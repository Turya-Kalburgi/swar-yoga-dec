# Data Saving Diagnostic Guide

## Quick Troubleshooting Steps

### Step 1: Check if User is Logged In
1. Open Developer Console (F12 or Cmd+Option+I)
2. Go to Application → Local Storage
3. Look for `user` key
4. Should see: `{"id":"your-user-id","name":"Your Name","email":"your@email.com"}`

**If no user found:**
- ❌ NOT LOGGED IN - Login first before using Life Planner
- Go to Sign In page and login

### Step 2: Enable Console Logging
1. Open Developer Console (F12)
2. Go to Console tab
3. Refresh page
4. Look for these logs:
   - `👤 getCurrentUserId: [your-user-id]` ← Should see this
   - `📤 API Request - POST /api/goals (userId: [your-user-id])` ← Should see this when you add
   - `✅ API Response - 201` ← Should see this after adding

**If you see warnings instead:**
```
⚠️ No user data in localStorage
⚠️ No userId found in localStorage - requests may fail
```
- ❌ NOT LOGGED IN - You need to login first

### Step 3: Test Adding a Goal
1. Go to Life Planner → My Goals
2. Click "+ Add Goal"
3. Fill in Title: "Test Goal 123"
4. Click "Create Goal"
5. **Watch the Console** for these logs in order:
   ```
   📤 API Request - POST /api/goals (userId: xxx) {...}
   ✅ API Response - 201 {...}
   ```

**If you see error instead:**
```
❌ API Error [400/401/500] - POST /api/goals: [error message]
```
Note the error message and status code.

### Step 4: Verify Data Persists
1. After adding goal, refresh page (Cmd+R)
2. Go back to Life Planner → My Goals
3. ✅ Your goal should still be visible

**If goal disappeared:**
- Check console for error on load: `❌ API Error [...] - GET /api/goals`
- This means backend is rejecting your requests

### Step 5: Common Issues & Solutions

#### Issue: "❌ API Error [401]"
**Cause:** Not logged in or session expired
**Solution:** 
- Go to Sign In page
- Login again
- Refresh page

#### Issue: "❌ API Error [400]"
**Cause:** Invalid data being sent
**Solution:**
- Check that Title field is not empty
- Make sure you're filling required fields
- Look at error message for what's wrong

#### Issue: "⚠️ No userId found in localStorage"
**Cause:** User not logged in
**Solution:**
- Login first at Sign In page
- Check localStorage shows `user` key after login

#### Issue: "✅ API Response 201" but goal not appearing
**Cause:** Component not handling response correctly
**Solution:**
- Check browser console for any other errors
- Refresh page to see if goal loads on next page load

---

## Console Logs Reference

| Log | Meaning | Status |
|-----|---------|--------|
| `👤 getCurrentUserId: abc123` | User ID found successfully | ✅ Good |
| `⚠️ No user data in localStorage` | User not logged in | ❌ Bad |
| `📤 API Request - POST /api/goals (userId: abc123)` | Request being sent | ℹ️ Info |
| `✅ API Response - 201` | Success - data created | ✅ Good |
| `✅ API Response - 200` | Success - data loaded | ✅ Good |
| `❌ API Error [401]` | Unauthorized - not logged in | ❌ Bad |
| `❌ API Error [400]` | Bad request - invalid data | ❌ Bad |
| `❌ API Error [500]` | Server error | ❌ Bad |

---

## What to Do if Still Not Working

1. **Copy all console logs** (right-click → Save as or take screenshot)
2. **Check the 5 most recent logs** for any errors
3. **Report the logs** to identify the exact issue

### Detailed Debug Steps
Open Console and run these commands one by one:

```javascript
// 1. Check if user exists
console.log('User in localStorage:', localStorage.getItem('user'));

// 2. Check API endpoint
console.log('API Base URL:', 'https://swar-yoga-dec.onrender.com/api');

// 3. Test a simple fetch
fetch('https://swar-yoga-dec.onrender.com/api/goals', {
  headers: {'X-User-ID': JSON.parse(localStorage.getItem('user') || '{}').id}
}).then(r => r.json()).then(d => console.log('Goals:', d));
```

---

## When Everything Works ✅

You should see:
- ✅ User logged in (check localStorage)
- ✅ Console logs show correct userId
- ✅ Goals appear when you add them
- ✅ Goals persist after page refresh
- ✅ No error messages in console

**Status: Data Saving is Working! 🎉**
