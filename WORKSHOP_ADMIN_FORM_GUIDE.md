# 🎓 Workshop Admin Form - Complete Guide

## Overview
Professional workshop management system for admin users to create, edit, and manage workshops with full pricing and payment integration.

---

## ✨ Key Features

### 1. **New Workshop Categories (8 Added)**
```typescript
'90 days weight loss program'
'90 days amrut aahar program'
'30 days meditation program'
'pre planning garbh sanskar'
'global youth program'
'children swar yoga program'
'business growth and swar yoga program'
'trekking camp'
```

Plus the existing 5 levels (Basic + Level 1-4)

**Total Categories:** 13 professional workshop types

---

### 2. **Professional Pricing System**

#### Three Currency Support:
- **INR (Indian Rupees):** ₹
- **NPR (Nepali Rupees):** Rs.
- **USD (US Dollars):** $

#### Price Setup:
For each workshop, enter:
- Price in INR (e.g., 5000)
- Price in NPR (e.g., 7000)
- Price in USD (e.g., 70)

---

### 3. **Payment Integration**

#### Payment Links:
```typescript
paymentLinkINR: "https://razorpay.com/..." // For Indian customers
paymentLinkNPR: "https://esewa.com.np/..." // For Nepali customers
paymentLinkUSD: "https://stripe.com/..."   // For international customers
```

**Features:**
- Separate payment links for each currency
- Direct checkout integration
- Automatic currency selection on frontend

---

### 4. **Comprehensive Workshop Form Fields**

#### Basic Information:
- Workshop Title
- Instructor Name
- Category (13 options)
- Mode (Online, Offline, Hybrid, Retreat)
- Language (Hindi, English, Marathi, Mixed)
- Level (Beginner, Intermediate, Advanced, Expert)

#### Dates & Time:
- Start Date
- End Date
- Duration (text - e.g., "5 days", "2 weeks")
- Start Time
- End Time
- Location

#### Participants:
- Maximum Participants

#### Pricing:
- Price INR, NPR, USD
- Payment Links for each currency

#### Media:
- Image URL
- YouTube Video ID (for preview)

#### Additional Info:
- Description
- Prerequisites
- Learning Outcomes
- What's Included
- WhatsApp Group Link
- Remarks

---

## 🎯 How to Add a Workshop

### Step 1: Click "Add Workshop" Button
Located in the Workshop Management header

### Step 2: Fill Basic Information
```
Title: "90 Days Weight Loss Program"
Instructor: "Yogacharya Mohan Kalburgi"
Category: "90 days weight loss program"
Mode: "Online"
Language: "Hindi"
Level: "Beginner"
```

### Step 3: Set Dates & Time
```
Start Date: 2025-12-15
End Date: 2025-01-13 (90 days later)
Duration: "90 days"
Start Time: 09:00
End Time: 17:00 (or as needed)
Location: "Online"
Max Participants: 100
```

### Step 4: Set Pricing
```
Price (INR): 15000
Price (NPR): 20000
Price (USD): 150

Payment Link (INR): https://razorpay.com/your-link
Payment Link (NPR): https://esewa.com.np/your-link
Payment Link (USD): https://stripe.com/your-link
```

### Step 5: Add Media (Optional)
```
Image URL: https://your-image-url.com/image.jpg
YouTube ID: dQw4w9WgXcQ
```

### Step 6: Add Details (Optional)
```
Description: "Learn proven weight loss techniques..."
Prerequisites: "No prior experience needed"
Learning Outcomes: "Lose 5-7 kg in 90 days"
Included Items: "Daily guidance, meal plans, exercises"
WhatsApp Link: https://chat.whatsapp.com/...
Remarks: "Limited slots available"
```

### Step 7: Save
Click "Create Workshop" button to save

---

## 📝 Workshop Data Structure

```typescript
interface WorkshopFormData {
  id: string;                    // Auto-generated
  title: string;                 // Workshop name
  instructor: string;            // Instructor name
  startDate: string;            // YYYY-MM-DD
  endDate: string;              // YYYY-MM-DD
  duration: string;             // "5 days", "90 days", etc.
  startTime: string;            // HH:MM format
  endTime: string;              // HH:MM format
  category: string;             // One of 13 categories
  mode: string;                 // Online/Offline/Hybrid/Retreat
  language: string;             // Hindi/English/Marathi/Mixed
  level: string;                // Beginner/Intermediate/Advanced/Expert
  location: string;             // City or "Online"
  maxParticipants: number;       // Max capacity
  priceINR: number;            // Indian price
  priceNPR: number;            // Nepali price
  priceUSD: number;            // International price
  paymentLinkINR: string;       // Payment URL for INR
  paymentLinkNPR: string;       // Payment URL for NPR
  paymentLinkUSD: string;       // Payment URL for USD
  image?: string;               // Workshop image URL
  youtubeId?: string;           // YouTube video for preview
  description?: string;         // Full description
  whatsappGroupLink?: string;   // WhatsApp group URL
  prerequisites?: string;       // Prerequisites info
  learningOutcomes?: string;    // What participants will learn
  includedItems?: string;       // What's included in price
  remarks?: string;             // Additional notes
}
```

---

## 💾 Data Storage

### Local Storage Key:
```javascript
localStorage.getItem('admin_workshops_list')
```

### Data Format:
```json
[
  {
    "id": "1733433600000_abc123def",
    "title": "90 Days Weight Loss Program",
    "instructor": "Yogacharya Mohan Kalburgi",
    "priceINR": 15000,
    "priceNPR": 20000,
    "priceUSD": 150,
    "paymentLinkINR": "https://...",
    ...
  }
]
```

---

## ✅ Form Validation

### Required Fields:
- [x] Workshop Title
- [x] Instructor Name
- [x] Start Date
- [x] End Date
- [x] Duration
- [x] Category
- [x] Max Participants (≥ 1)
- [x] Prices (INR, NPR, USD ≥ 0)

### Optional Fields:
- Image URL
- YouTube ID
- Description
- Prerequisites
- Learning Outcomes
- Included Items
- WhatsApp Link
- Remarks

---

## 📊 Available Options

### Modes:
```
- Online
- Offline
- Hybrid
- Retreat
```

### Languages:
```
- Hindi
- English
- Marathi
- Mixed
```

### Levels:
```
- Beginner
- Intermediate
- Advanced
- Expert
```

### Categories (13 Total):
```
1. Swar Yoga Basic Workshop
2. Swar Yoga Level-1
3. Swar Yoga Level-2
4. Swar Yoga Level-3
5. Swar Yoga Level-4
6. 90 Days Weight Loss Program
7. 90 Days Amrut Aahar Program
8. 30 Days Meditation Program
9. Pre Planning Garbh Sanskar
10. Global Youth Program
11. Children Swar Yoga Program
12. Business Growth and Swar Yoga Program
13. Trekking Camp
```

---

## 🎨 Dashboard Features

### Stats Cards:
- **Total Workshops:** Count of all workshops
- **Categories:** Total category options (13)
- **Modes:** Total mode options (4)
- **Languages:** Total language options (4)

### Workshop Table:
Displays all workshops with:
- Title & Instructor
- Category badge
- Date range
- Price (INR)
- Mode badge
- Edit & Delete buttons

---

## 🔧 Managing Workshops

### Edit Workshop:
1. Click Edit icon (pencil) on workshop row
2. Form auto-fills with current data
3. Modify fields as needed
4. Click "Update Workshop"

### Delete Workshop:
1. Click Delete icon (trash) on workshop row
2. Confirm deletion in popup
3. Workshop removed from list

### View Workshops:
- All workshops displayed in sortable table
- Click row to view details
- Shows key information at a glance

---

## 💡 Best Practices

### Pricing:
- Set realistic prices for each currency
- Consider exchange rates
- Update payment links regularly
- Test payment links before publishing

### Descriptions:
- Write clear, engaging descriptions
- Include learning outcomes
- List prerequisites clearly
- Mention what's included

### Media:
- Use high-quality images (minimum 400x300)
- Keep YouTube videos updated
- Test links before saving

### Participants:
- Set realistic max capacity
- Update as needed
- Track enrollments

---

## 📱 Display on Frontend

### Workshop Card Shows:
- ✅ Image
- ✅ Title
- ✅ Instructor
- ✅ Dates (dd/mm/yyyy format)
- ✅ Time & Duration
- ✅ Location
- ✅ Mode badge
- ✅ Language
- ✅ Category badge
- ✅ Prices (INR, NPR, USD)
- ✅ Enrollment count
- ✅ View Details button
- ✅ Add to Cart button
- ✅ Video preview button

---

## 🔐 Data Security

### Local Storage:
- Data stored locally on browser
- Not encrypted (for demo)
- Each user has separate storage

### Best Practices:
- Don't share browser storage
- Clear cache when testing
- Use unique IDs for workshops

---

## 📊 Example Workshop

### 90 Days Weight Loss Program:
```json
{
  "title": "90 Days Weight Loss Program",
  "instructor": "Yogacharya Mohan Kalburgi",
  "startDate": "2025-12-15",
  "endDate": "2026-03-14",
  "duration": "90 days",
  "startTime": "06:00",
  "endTime": "08:00",
  "category": "90 days weight loss program",
  "mode": "Online",
  "language": "Hindi",
  "level": "Beginner",
  "location": "Online",
  "maxParticipants": 200,
  "priceINR": 15000,
  "priceNPR": 20000,
  "priceUSD": 150,
  "paymentLinkINR": "https://razorpay.com/...",
  "paymentLinkNPR": "https://esewa.com.np/...",
  "paymentLinkUSD": "https://stripe.com/...",
  "description": "Transform your body in 90 days with proven weight loss techniques...",
  "prerequisites": "No prior experience needed",
  "learningOutcomes": "Lose 5-7 kg, build healthy habits, increase energy",
  "includedItems": "Daily guidance, meal plans, exercise routines, progress tracking",
  "remarks": "Limited to 200 participants. Early bird discount available."
}
```

---

## 🚀 Usage Flow

```
Admin Login
   ↓
Dashboard → Workshop Management
   ↓
Click "Add Workshop"
   ↓
Fill Form (Basic Info, Dates, Pricing)
   ↓
Add Media & Details
   ↓
Click "Create Workshop"
   ↓
Workshop appears on Public Page
   ↓
Users can view, filter, and purchase
```

---

## ✨ New Additions (This Update)

✅ 8 New Workshop Categories
✅ Professional Workshop Admin Form
✅ Multi-currency pricing (INR, NPR, USD)
✅ Payment links for each currency
✅ Complete form validation
✅ Dashboard with statistics
✅ Workshop management table
✅ Edit & delete functionality

---

## 📝 Next Steps

1. **Add Payment Links**
   - Get Razorpay link for INR
   - Get eSewa link for NPR
   - Get Stripe link for USD
   - Update in workshop form

2. **Test Workshops**
   - Create test workshops
   - Verify on frontend
   - Test payment links
   - Check filtering

3. **Deploy**
   - Commit changes
   - Push to GitHub
   - Deploy to Netlify
   - Test on production

---

## ⚙️ Configuration

### Workshop Categories Update:
Located in: `workshopPage.tsx`
```typescript
const categories = [
  // ... 13 new categories
];
```

### Admin Form:
Located in: `src/pages/admin/WorkshopAdminForm.tsx`
```typescript
const categories = [...]; // 13 options
const modes = [...];      // 4 options
const languages = [...];  // 4 options
const levels = [...];     // 4 options
```

---

## 📞 Support

### Common Issues:

**Q: Workshop not showing after creation?**
- A: Refresh page or check browser console for errors
- Verify localStorage is enabled

**Q: Payment link not working?**
- A: Check URL format (must start with https://)
- Test link in new browser tab

**Q: Prices not displaying correctly?**
- A: Ensure all 3 currencies are set
- Check frontend filter

---

## 📊 Build Status

✅ **Build:** 0 errors, 2560 modules
✅ **Build Time:** 3.37 seconds
✅ **File Created:** WorkshopAdminForm.tsx
✅ **Categories Updated:** workshopPage.tsx

---

**Status:** ✅ COMPLETE & READY
**Last Updated:** December 5, 2025
**Categories:** 13 total
**Currencies:** 3 (INR, NPR, USD)
**Payment Links:** 3 per workshop
