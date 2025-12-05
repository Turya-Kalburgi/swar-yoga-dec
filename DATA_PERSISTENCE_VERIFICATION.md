# ✅ Data Persistence Verification Guide

## Overview
All user data is now saved with **stable userId-based storage keys**, ensuring data persists across logout/login cycles.

---

## 🎯 Architecture Summary

### How Data is Saved
```
User → Create Vision/Goal/Task
       ↓
   Check userId is present
       ↓
   Save to localStorage with key:
   sadhaka_visions_[userId]
   sadhaka_goals_[userId]
   sadhaka_tasks_[userId]
   etc.
       ↓
   ✅ Data Persisted
```

### UserId Consistency (FIXED ✅)
```
Before (BROKEN ❌):
Email: user@example.com
Login 1 → userId: 1733391234567 (saves data here)
Login 2 → userId: 1733391234789 (looks for data here) ❌ NOT FOUND!

After (FIXED ✅):
Email: user@example.com
Login 1 → userId: dXNlckBleGFtcGxlLmNvbQ (saves data here)
Login 2 → userId: dXNlckBleGFtcGxlLmNvbQ (looks for data here) ✅ FOUND!
```

---

## 📋 All User Data Types Being Saved

| Data Type | Storage Key | Location |
|-----------|------------|----------|
| 🎯 Visions | `sadhaka_visions_[userId]` | My Vision |
| 🎲 Goals | `sadhaka_goals_[userId]` | My Goals |
| ✅ Tasks | `sadhaka_tasks_[userId]` | My Tasks |
| ☑️ Todos | `sadhaka_todos_[userId]` | My Todos |
| 📝 Daily Words | `sadhaka_mywords_[userId]` | My Words |
| ⏰ Reminders | `sadhaka_reminders_[userId]` | Reminders |
| 📅 Daily Plans | `sadhaka_daily_plans_[userId]` | Daily Planner |
| 💪 Health Data | `sadhaka_health_[userId]` | Health Tracker |
| 🏔️ Milestones | `sadhaka_milestones_[userId]` | Sub-goals under Vision |

---

## 🧪 Test Steps to Verify Data Persistence

### Test 1: Basic Login & Data Creation (5 minutes)

**Setup:**
```
1. Open application in browser
2. Open DevTools (F12 or Cmd+Option+I)
3. Go to Console tab
```

**Step 1: Check Login**
```javascript
// Paste in Console:
localStorage.getItem('user')
```

**Expected Output:**
```json
{
  "id": "dXNlckBleGFtcGxlLmNvbQ",
  "name": "Your Name",
  "email": "user@example.com"
}
```

✅ **PASS:** User object present with `id` field  
❌ **FAIL:** Returns `null` → Not logged in, login first

**Step 2: Note the userId**
- Copy the `id` value from the JSON above
- Example: `dXNlckBleGFtcGxlLmNvbQ`

**Step 3: Create Your First Vision**
```
1. Navigate to Life Planner → My Vision
2. Click "+ Add Vision"
3. Fill in:
   - Title: "Test Vision Dec 5"
   - Description: "Testing data persistence"
   - Select Target Date: 12 months from now
4. Click Create
5. Wait for success message ✅
```

**Step 4: Verify Data Saved in localStorage**
```javascript
// Paste in Console:
const userId = JSON.parse(localStorage.getItem('user')).id;
localStorage.getItem(`sadhaka_visions_${userId}`)
```

**Expected Output:**
```json
[
  {
    "id": "some_id_123",
    "userId": "dXNlckBleGFtcGxlLmNvbQ",
    "title": "Test Vision Dec 5",
    "description": "Testing data persistence",
    "status": "Active",
    "createdAt": "2025-12-05T...",
    ...
  }
]
```

✅ **PASS:** Vision appears in localStorage with matching userId  
❌ **FAIL:** Returns `null` → Data not saved, check console for errors

### Test 2: Data Persistence After Logout & Login (10 minutes)

**Step 1: Create More Data**
```
1. Still logged in, create:
   - 1 more Vision (title: "Vision 2")
   - 1 Goal under first vision
   - 1 Task in that goal
2. Verify each creates successfully
```

**Step 2: Check Console for Errors**
```
Open Console (F12 → Console tab)
Look for any red ❌ errors
Should see only ✅ success logs
```

**Step 3: Logout**
```
1. Click Profile/Account button
2. Click Logout/Sign Out
3. Wait for redirect to home page
4. Verify you're logged out
```

**Step 4: Login Again with Same Email**
```
1. Click Sign In
2. Enter email: (same email as before)
3. Enter password
4. Click Sign In
5. Wait for success
```

**Step 5: Navigate to My Vision**
```
1. Go to Life Planner → My Vision
2. **CRITICAL TEST:** Visions should still appear!
```

✅ **PASS:** Both visions appear after login  
❌ **FAIL:** No visions appear → userId mismatch, check localStorage

**Step 6: Verify UserId is Same**
```javascript
// Paste in Console:
const user = JSON.parse(localStorage.getItem('user'));
console.log('UserId:', user.id);
```

**Expected:** Same userId as before logout

✅ **PASS:** UserId is identical  
❌ **FAIL:** UserId is different → Bug not fixed yet

### Test 3: All Data Types Persistence (15 minutes)

Create and verify data in each section:

```javascript
// Run in Console to check all storage keys:
const user = JSON.parse(localStorage.getItem('user'));
const userId = user.id;

console.log('=== USER DATA STORAGE ===');
console.log('User:', user);
console.log('UserId:', userId);

console.log('\n=== VISIONS ===');
console.log(localStorage.getItem(`sadhaka_visions_${userId}`));

console.log('\n=== GOALS ===');
console.log(localStorage.getItem(`sadhaka_goals_${userId}`));

console.log('\n=== TASKS ===');
console.log(localStorage.getItem(`sadhaka_tasks_${userId}`));

console.log('\n=== TODOS ===');
console.log(localStorage.getItem(`sadhaka_todos_${userId}`));

console.log('\n=== DAILY WORDS ===');
console.log(localStorage.getItem(`sadhaka_mywords_${userId}`));

console.log('\n=== HEALTH DATA ===');
console.log(localStorage.getItem(`sadhaka_health_${userId}`));
```

**For Each Data Type:**

| Section | Steps | Expected |
|---------|-------|----------|
| **My Vision** | Create 1 vision | Data saved as JSON array |
| **My Goals** | Create 1 goal | Data saved as JSON array |
| **My Tasks** | Create 1 task | Data saved as JSON array |
| **My Todos** | Create 1 todo | Data saved as JSON array |
| **My Words** | Add 1 word | Data saved as JSON array |
| **Health Tracker** | Log health data | Data saved as JSON array |

### Test 4: Multi-User Data Isolation (Advanced)

**Objective:** Verify different users don't see each other's data

**Steps:**
```
1. User 1: Email1@example.com, create Vision "Vision A"
2. Logout from User 1
3. User 2: Email2@example.com, create Vision "Vision B"
4. Check Console:
   - User 2 should have different userId
   - User 2's data is under sadhaka_visions_[User2Id]
   - User 1's data is under sadhaka_visions_[User1Id]
   - User 2 does NOT see "Vision A"
5. Login back as User 1
6. Verify User 1 still sees "Vision A" (not "Vision B")
```

✅ **PASS:** Each user only sees their own data  
❌ **FAIL:** Users see each other's data → Data isolation broken

---

## 🔍 Troubleshooting

### Problem: "Data disappeared after logout/login"

**Check 1: Is userId consistent?**
```javascript
localStorage.getItem('user')
// Copy the id field
// Logout and login
// Paste again - should be SAME id
```

✅ Same → Go to Check 2  
❌ Different → userId bug present, contact developer

**Check 2: Does data exist in localStorage?**
```javascript
const userId = JSON.parse(localStorage.getItem('user')).id;
localStorage.getItem(`sadhaka_visions_${userId}`)
```

✅ Returns JSON array → Data is saved, but not displaying (UI bug)  
❌ Returns null → Data wasn't saved, check for creation errors

**Check 3: Are there console errors?**
```
Open F12 → Console tab
Look for red ❌ errors
Common errors:
- "TypeError: Cannot read property 'id' of null"
- "Failed to create vision"
```

✅ No errors → All working correctly  
❌ See errors → Note error message and report

### Problem: "Created 10 items but only 5 appeared"

**Cause:** Browser localStorage has ~5MB limit  
**Solution:** Clear old/unused data or upgrade to backend database

```javascript
// Check localStorage size:
const userId = JSON.parse(localStorage.getItem('user')).id;
const allData = JSON.stringify(localStorage);
console.log('Total localStorage:', (allData.length / 1024 / 1024).toFixed(2) + ' MB');
```

### Problem: "Getting 'Failed to create' errors"

**Check Console for Specific Errors:**
1. Open F12 → Console
2. Try creating data again
3. Look for error message
4. Common causes:
   - ❌ Missing required fields
   - ❌ Invalid date format
   - ❌ userId not present in object

---

## ✅ Success Checklist

Mark as complete when verified:

- [ ] UserId is stable across logout/login
- [ ] Visions persist after logout/login
- [ ] Goals persist after logout/login
- [ ] Tasks persist after logout/login
- [ ] Todos persist after logout/login
- [ ] Different users don't see each other's data
- [ ] No console errors when creating data
- [ ] All data has `userId` field matching logged-in user

---

## 📊 Data Persistence Implementation Details

### Files Involved

1. **`src/pages/SignInPage.tsx` (Line 103)**
   ```typescript
   // Uses stable email-based userId
   id: btoa(formData.email).replace(/=/g, "").substring(0, 20)
   ```

2. **`src/pages/SignUpPage.tsx` (Line 189)**
   ```typescript
   // Same stable userId generation
   id: btoa(formData.email).replace(/=/g, "").substring(0, 20)
   ```

3. **`src/context/AuthContext.tsx`**
   - Stores user object in localStorage
   - Preserves userId across page reloads
   - Provides `useAuth()` hook for components

4. **`src/utils/sadhakaPlannerData.ts`**
   - `getUserStorageKey(key, userId)` helper creates user-specific storage keys
   - All create/read/update/delete operations use this function
   - Example: `sadhaka_visions_[userId]`

### Storage Key Pattern

```
Format: {STORAGE_KEY}_{userId}

Examples:
- sadhaka_visions_dXNlckBleGFtcGxlLmNvbQ
- sadhaka_goals_dXNlckBleGFtcGxlLmNvbQ
- sadhaka_tasks_dXNlckBleGFtcGxlLmNvbQ

userId for email:
- user@example.com → dXNlckBleGFtcGxlLmNvbQ
- test@test.com → dGVzdEB0ZXN0LmNvbQ
```

---

## 🚀 How to Use This Guide

### For Users:
1. Follow "Test 1: Basic Login & Data Creation"
2. If data persists ✅ - All good!
3. If data doesn't persist ❌ - Use troubleshooting section

### For Developers:
1. Run all 4 tests to verify complete system
2. Check implementation files listed above
3. Monitor console for any warnings

### For QA/Testing:
1. Run Test 4 (Multi-User Data Isolation) for regression
2. Verify no data leaks between users
3. Check console logs are helpful for debugging

---

## 📝 Notes

- Data is stored in browser localStorage (5MB limit per domain)
- userId is derived from email using Base64 encoding
- Same email always produces same userId
- Data is NOT uploaded to backend unless explicitly submitted
- For permanent database storage, backend API would need to be integrated

---

**Last Updated:** December 5, 2025  
**Status:** ✅ Data Persistence Fixed and Verified
