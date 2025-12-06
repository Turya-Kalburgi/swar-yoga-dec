# 🔐 ADMIN DASHBOARD GUIDE

## What is the Admin Dashboard?

The Admin Dashboard is a **management panel** where you can see:
- ✅ All user statistics
- ✅ Total signups and logins
- ✅ Contact messages
- ✅ Workshop enrollments
- ✅ Cart activities
- ✅ System overview

---

## 🔗 How to Access Admin Dashboard

### Step 1: Go to Admin Login
```
URL: http://localhost:5173/admin
or
URL: http://yourdomain.com/admin
```

### Step 2: Enter Credentials
```
Username: admin
Password: Mohan@123pk
```

### Step 3: You'll See Dashboard Stats

---

## 📊 Admin Dashboard Statistics

The dashboard shows real-time data from MongoDB:

### Users Statistics
```
Total Users: Count of all registered users
Active Users: Users who logged in recently
Recent Signups: New users in last 30 days
Recent Signins: Active login events
```

### Platform Statistics
```
Total Workshops: All published workshops
Public Workshops: Workshops available to users
Total Enrollments: Users enrolled in workshops
```

### Activity Statistics
```
Cart Items: Products in shopping carts
Contact Messages: Messages from contact form
```

---

## 📈 Dashboard Sections

### 1. User Overview
- Shows total users registered
- Active users (logged in last 30 days)
- Recent signup trends
- Login activity

### 2. Workshop Management
- Total workshops created
- Public vs private workshops
- User enrollments
- Workshop statistics

### 3. Orders & Cart
- Shopping cart items
- Pending orders
- Cart abandonment rate

### 4. Messages
- Contact form submissions
- Unread messages count
- Message status tracking

### 5. Activity Log
- Recent user actions
- Login timestamps
- IP addresses
- Device information

---

## 🔐 How MongoDB Data Appears in Admin Dashboard

### From SIGNUPDATA Collection
```
Total Signups: db.signupdata.countDocuments({})
Signups by Country: db.signupdata.aggregate([{$group: {_id: "$country", count: {$sum: 1}}}])
Recent Signups: db.signupdata.find().sort({timestamp: -1}).limit(10)
```

### From SIGNINDATA Collection
```
Total Logins: db.signindata.countDocuments({})
Active Users: db.signindata.distinct("email").length
Logins by Device: db.signindata.aggregate([{$group: {_id: "$device", count: {$sum: 1}}}])
Recent Logins: db.signindata.find().sort({timestamp: -1}).limit(20)
```

### From USERS Collection
```
Total Users: db.users.countDocuments({})
Users by Country: db.users.aggregate([{$group: {_id: "$country", count: {$sum: 1}}}])
```

### From CONTACTS Collection
```
Total Messages: db.contacts.countDocuments({})
Unread Messages: db.contacts.countDocuments({status: "new"})
Messages Today: db.contacts.find({createdAt: {$gte: ISODate("2025-12-06")}})
```

### From User Data Collections
```
Total Visions: db.visions.countDocuments({})
Total Goals: db.goals.countDocuments({})
Total Todos: db.todos.countDocuments({})
Total Health Records: db.health.countDocuments({})
```

---

## 🎯 Admin Dashboard Features

### Dashboard Cards
```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ Total Users     │  │ Total Workshops │  │ Cart Items      │
│ 2               │  │ 15              │  │ 25              │
└─────────────────┘  └─────────────────┘  └─────────────────┘

┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ Recent Signups  │  │ Recent Logins   │  │ Contact Messages│
│ 2               │  │ 15              │  │ 8               │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### Admin Actions
- ✅ View all users
- ✅ View signup records
- ✅ View login records
- ✅ View contact messages
- ✅ View workshop enrollments
- ✅ Clear dummy data
- ✅ Export reports

---

## 📱 Admin Pages Available

1. **AdminDashboard.tsx**
   - Main overview with statistics
   - Quick stats cards
   - Recent activities

2. **AdminSigninData.tsx**
   - View all login records
   - Filter by email, date, device
   - Export login history

3. **AdminSignupData.tsx**
   - View all registration records
   - Filter by country, profession
   - Export user signups

4. **AdminContactData.tsx**
   - View contact messages
   - Mark as read/unread
   - Reply to messages

5. **AdminCartData.tsx**
   - View shopping cart items
   - See abandoned carts
   - Track customer activity

6. **AdminWorkshops.tsx**
   - Manage workshops
   - View enrollments
   - Edit workshop details

7. **CertificateCreator.tsx**
   - Create certificates
   - Generate PDFs
   - Award to users

---

## 🔍 Data Available in Admin Dashboard

### User Data
- Email addresses
- Names and contact information
- Countries and states
- Age and profession
- Registration date
- Login history
- Device information
- IP addresses

### Activity Data
- Signup timestamps
- Login timestamps
- Contact submissions
- Message content
- Cart activities
- Workshop enrollments

### Analytics Data
- User growth trends
- Geographic distribution
- Device/browser breakdown
- Login patterns
- Peak activity times

---

## 📊 Create Custom Reports

### In Admin Dashboard, you can:

1. **Export User Data**
   - Download all users as CSV/JSON
   - Filter by date range
   - Select specific fields

2. **Export Login Records**
   - Download login history
   - Filter by date, device, country
   - Analyze user behavior

3. **Export Contact Messages**
   - Download all messages
   - Filter by status
   - Archive important messages

4. **View Analytics**
   - User acquisition rate
   - Active users per day
   - Login frequency
   - Geographic distribution

---

## 🚀 Access Admin Dashboard

### Local Development
```
URL: http://localhost:5173/admin
Username: admin
Password: Mohan@123pk
```

### Production (After Deployment)
```
URL: https://yourdomain.com/admin
Username: admin
Password: Mohan@123pk
```

---

## ✅ Admin Dashboard Capabilities

✅ View real-time statistics from MongoDB
✅ See all users, signups, logins in one place
✅ Monitor contact messages and responses
✅ Track workshop enrollments
✅ Analyze user behavior and trends
✅ Export data for reporting
✅ Create custom dashboards
✅ Generate certificates
✅ Manage workshops and content
✅ View cart and order data
✅ Track system health

---

## 🔐 Admin Credentials

```
Access: http://localhost:5173/admin

Username: admin
Password: Mohan@123pk

⚠️ Keep these credentials secure!
```

---

## 📋 What Admin Can See from MongoDB Collections

| Collection | Admin Can See |
|-----------|--------------|
| users | All user accounts, contact info |
| signupdata | All registration records |
| signindata | All login records, IP, device |
| contacts | All contact form messages |
| visions | All user visions (by user) |
| goals | All user goals (by user) |
| tasks | All user tasks (by user) |
| todos | All user todos (by user) |
| health | All health records (by user) |
| reminders | All reminders (by user) |
| dailyplans | All daily plans (by user) |
| milestones | All milestones (by user) |

---

## 🎯 Admin Dashboard Features

### 1. Statistics Overview
- Total users, signups, logins
- Workshop statistics
- Cart and order data
- Message count

### 2. User Management
- View all registered users
- See user details
- Track signup dates
- Monitor login activity

### 3. Message Management
- View contact messages
- Mark as read/unread
- Reply to messages
- Archive messages

### 4. Workshop Management
- Create/edit workshops
- Manage enrollments
- View student list
- Issue certificates

### 5. Analytics
- User growth trends
- Geographic distribution
- Device statistics
- Activity patterns

---

## 💡 Tips for Admin

1. **Check Dashboard Daily**
   - Monitor new signups
   - See active users
   - Track contact messages

2. **Respond to Messages**
   - Check contact messages regularly
   - Reply to user inquiries
   - Mark as resolved

3. **Monitor Trends**
   - Watch user growth
   - Analyze login patterns
   - Check geographic data

4. **Manage Content**
   - Update workshops
   - Create new content
   - Manage certificates

5. **Export Reports**
   - Generate user reports
   - Export login history
   - Download analytics

---

## 🚀 Next Steps

1. **Access Admin Dashboard**: http://localhost:5173/admin
2. **Log in** with admin credentials
3. **View statistics** from MongoDB
4. **Manage users** and content
5. **Monitor activity** and trends
6. **Export reports** as needed

---

**Your Admin Dashboard is ready to use!** 🎉

All data from MongoDB Atlas is automatically displayed in real-time.
