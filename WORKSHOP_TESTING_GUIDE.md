# 🧪 Testing Workshop Admin → Public Display

## How to Add a Workshop in Admin Panel & See It on Main Page

### Step-by-Step Instructions:

#### 1. **Login to Admin Panel**
```
URL: http://localhost:5176/admin
Username: admin
Password: Mohan@123pk
```

#### 2. **Navigate to Admin Workshops**
- Click on **"Admin Panel"** in header
- Click on **"Workshops"** in sidebar (or navigate to `/admin/workshops`)

#### 3. **Click "Add Workshop" Button**
- Fill in the form with workshop details:

**Example Test Workshop:**
```
Title: Beginner Yoga Class
Instructor: Mohan Kalburgi
Start Date: 2025-12-10
End Date: 2025-12-20
Duration: 2 weeks
Start Time: 09:00 AM
End Time: 05:00 PM
Price (INR): 999
Max Participants: 50
Category: Beginner
Mode: Online
Language: Hindi
Level: Beginner
Location: Online
Image URL: (paste any image URL or leave blank)
```

#### 4. **IMPORTANT: Check "Make Public" Checkbox**
⚠️ **This is critical!** The workshop will NOT show on the main page if `isPublic` is not checked.

#### 5. **Click "Add Workshop" Button**
- You should see: ✅ "Workshop added successfully"
- Workshop appears in the admin list

#### 6. **Verify on Main Page**
- Go to: http://localhost:5176/workshops
- You should see your newly added workshop in the list

---

## 🔍 How It Works

### Data Flow:
```
Admin Panel (AdminWorkshops.tsx)
    ↓
    └─ createWorkshop() → workshopAPI.ts
        ↓
        └─ POST /api/admin/workshops
            ↓
            └─ Stored in server-data.json (or API database)

Main Page (WorkshopPage.tsx)
    ↓
    └─ getPublicWorkshops() → workshopAPI.ts
        ↓
        └─ GET /api/admin/workshops/public
            ↓
            └─ Filters workshops where isPublic === true
```

### Key Points:

✅ **Workshops stored in:**
- `server-data.json` (if server is running)
- OR `localStorage` (browser fallback)

✅ **Public visibility:**
- Only workshops with `isPublic: true` show on main page
- Admin can toggle visibility with eye icon

✅ **Real-time sync:**
- Changes sync across tabs instantly (BroadcastChannel)
- Main page auto-refreshes every 10 seconds
- Manual refresh button available

✅ **Multi-tab support:**
- Add in admin panel on one tab
- See appear on main page on another tab automatically

---

## 🔧 Troubleshooting

### Problem: Workshop not showing on main page
**Solutions:**
1. ✅ Check if `isPublic` is enabled
2. ✅ Refresh the page (or wait 10 seconds for auto-refresh)
3. ✅ Click the refresh button on workshops page
4. ✅ Check browser console for errors
5. ✅ Verify server is running (if using API storage)

### Problem: Workshop deleted when page refreshes
**Solutions:**
1. ✅ Ensure server is running for persistent storage
2. ✅ Without server, data is stored in localStorage only
3. ✅ Clear browser cache might cause loss

### Problem: Changes not syncing between tabs
**Solutions:**
1. ✅ BroadcastChannel requires same origin
2. ✅ Manual refresh can be used if sync fails
3. ✅ Check browser console for errors

---

## 📊 Form Fields Reference

| Field | Required | Type | Notes |
|-------|----------|------|-------|
| Title | ✅ | Text | Workshop name |
| Instructor | ✅ | Text | Instructor name |
| Start Date | ✅ | Date | When workshop starts |
| End Date | ✅ | Date | When workshop ends |
| Duration | ✅ | Text | e.g., "2 weeks", "5 days" |
| Start Time | ✅ | Time | 24-hour format |
| End Time | ✅ | Time | 24-hour format |
| Price (INR) | ✅ | Number | Auto-calculates NPR/USD |
| Max Participants | ✅ | Number | Capacity |
| Category | ✅ | Select | Beginner/Intermediate/Advanced |
| Mode | ✅ | Select | Online/In-Person/Hybrid |
| Language | ✅ | Select | Hindi/English/Sanskrit |
| Level | ✅ | Select | Beginner/Intermediate/Advanced |
| Location | ❌ | Text | For in-person workshops |
| Image | ❌ | URL | Workshop thumbnail |
| YouTube ID | ❌ | Text | For demo videos |
| Payment Links | ❌ | URL | For each currency |
| Prerequisites | ❌ | Text | What students need to know |
| Learning Outcomes | ❌ | Text | What students will learn |
| Included Items | ❌ | Text | What's included |
| Remarks | ❌ | Text | Additional notes |
| **Make Public** | ✅ | Toggle | **Must be checked to show on main page** |

---

## 🎯 Testing Scenarios

### Scenario 1: Add Public Workshop
```
1. Add workshop with isPublic = YES
2. Expected: Shows on main page immediately
3. Verify: Goes to /workshops and see it listed
```

### Scenario 2: Add Private Workshop (Draft)
```
1. Add workshop with isPublic = NO
2. Expected: NOT visible on main page
3. Expected: Visible in admin panel only
4. Click eye icon to toggle public
5. Workshop should appear on main page
```

### Scenario 3: Edit Workshop
```
1. In admin, find workshop
2. Click edit icon
3. Change details
4. Click update
5. Verify changes on main page
```

### Scenario 4: Delete Workshop
```
1. In admin, find workshop
2. Click trash icon
3. Confirm deletion
4. Verify removed from admin list
5. Verify removed from main page
```

### Scenario 5: Multi-tab Sync
```
1. Open admin panel in Tab 1
2. Open workshops page in Tab 2
3. Add workshop in Tab 1
4. Tab 2 should update automatically (or within 10 seconds)
5. Verify workshop appears in Tab 2
```

---

## 📱 Expected UI Elements

### Admin Panel (AdminWorkshops.tsx):
- ✅ Search bar
- ✅ Filter buttons (All/Public/Draft)
- ✅ "Add Workshop" button (blue)
- ✅ Workshop cards with:
  - Title
  - Instructor
  - Dates
  - Status (eye icon)
  - Edit button
  - Delete button
  - Visibility toggle

### Main Page (WorkshopPage.tsx):
- ✅ Search bar
- ✅ Filter dropdowns (Month/Mode/Language/Category)
- ✅ "Refresh" button
- ✅ Workshop cards with:
  - Image
  - Title
  - Instructor
  - Dates & Times
  - Duration
  - Price
  - "View Details" button
  - "Add to Cart" button
  - "Watch Demo" button (if YouTube ID)

---

## 🚀 Quick Test Command

To test everything works:

```bash
# 1. Ensure dev server is running
npm run dev

# 2. Open three browser tabs:
# Tab 1: Admin login and add workshop
# Tab 2: Watch workshops page to see it appear
# Tab 3: Verify in browser DevTools → Application → localStorage

# 3. Check console logs:
# Look for "✅ Loaded workshops from API"
# Look for "📡 Received workshop update"
```

---

## 📝 Testing Notes

**Last Updated:** December 4, 2025
**Status:** Ready for testing
**Components:** AdminWorkshops ✅, WorkshopPage ✅, workshopAPI ✅
**Storage:** localStorage + server-data.json support
**Sync:** BroadcastChannel + auto-refresh enabled
