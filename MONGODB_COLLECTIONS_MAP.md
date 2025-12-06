# 🗂️ MongoDB Collections Deep Dive

## Data Storage Map - All Routes to MongoDB Atlas

### FRONTEND → BACKEND → MONGODB ATLAS

---

## 📊 Collection Operations Matrix

### VISIONS Collection
```
Frontend: VisionComponent.tsx
  ↓
API Endpoint: /api/visions
  ↓
Backend Route: server/routes/visions.ts
  ↓
Model: server/models/Vision.ts (IVision interface)
  ↓
MongoDB Atlas: db.visions
  └─ Fields: _id, userId, visionStatement, timeFrame, description, 
             category, visualImageUrl, affirmations, status, priority
```

**Operations:**
- `POST /api/visions` → `Vision.create()`
- `GET /api/visions` → `Vision.find({ userId })`
- `GET /api/visions/:id` → `Vision.findById()`
- `PUT /api/visions/:id` → `Vision.findByIdAndUpdate()`
- `DELETE /api/visions/:id` → `Vision.deleteOne()`

---

### GOALS Collection
```
Frontend: GoalsComponent.tsx
  ↓
API Endpoint: /api/goals
  ↓
Backend Route: server/routes/goals.ts
  ↓
Model: server/models/Goal.ts (IGoal interface)
  ↓
MongoDB Atlas: db.goals
  └─ Fields: _id, userId, goalTitle, linkedVisionId, description,
             timeFrame, category, priority, status, targetDate, 
             milestones, progress
```

**Relations:**
- Linked to VISIONS via `linkedVisionId`
- One-to-many relationship (Vision → Goals)

---

### TASKS Collection
```
Frontend: TasksComponent.tsx
  ↓
API Endpoint: /api/tasks
  ↓
Backend Route: server/routes/tasks.ts
  ↓
Model: server/models/Task.ts (ITask interface)
  ↓
MongoDB Atlas: db.tasks
  └─ Fields: _id, userId, taskTitle, linkedGoalId, description,
             priority, status, dueDate, timeRequired, category,
             subtasks, attachments
```

**Relations:**
- Linked to GOALS via `linkedGoalId`
- One-to-many relationship (Goal → Tasks)

---

### TODOS Collection
```
Frontend: MyTodos.tsx
  ↓
API Endpoint: /api/todos
  ↓
Backend Route: server/routes/todos.ts
  ↓
Model: server/models/Todo.ts (ITodo interface)
  ↓
MongoDB Atlas: db.todos
  └─ Fields: _id, userId, todoTitle, description, completed,
             status, priority, dueDate, category
```

**Status:** Independent collection (no foreign keys)

---

### MYWORDS Collection
```
Frontend: MyWordComponent.tsx
  ↓
API Endpoint: /api/mywords
  ↓
Backend Route: server/routes/mywords.ts
  ↓
Model: server/models/MyWord.ts (IMyWord interface)
  ↓
MongoDB Atlas: db.mywords
  └─ Fields: _id, userId, wordText, affirmationType, category,
             source, frequency, lastRecited, recitationCount, impact, tags
```

**Purpose:** Store affirmations and personal words of power

---

### MILESTONES Collection
```
Frontend: MilestonesComponent.tsx
  ↓
API Endpoint: /api/milestones
  ↓
Backend Route: server/routes/milestones.ts
  ↓
Model: server/models/Milestone.ts (IMilestone interface)
  ↓
MongoDB Atlas: db.milestones
  └─ Fields: _id, userId, title, description, linkedGoalId,
             dueDate, status, completionDate
```

**Relations:**
- Linked to GOALS via `linkedGoalId`
- Tracks major progress points

---

### REMINDERS Collection
```
Frontend: (Via context)
  ↓
API Endpoint: /api/reminders
  ↓
Backend Route: server/routes/reminders.ts
  ↓
Model: server/models/Reminder.ts (IReminder interface)
  ↓
MongoDB Atlas: db.reminders
  └─ Fields: _id, userId, title, description, reminderDate,
             reminderTime, status, linkedTaskId, type
```

**Purpose:** Store notifications for tasks, goals, and custom reminders

---

### DAILYPLANS Collection
```
Frontend: DailyRoutine.tsx / DailyPlanComponent.tsx
  ↓
API Endpoint: /api/dailyplans
  ↓
Backend Route: server/routes/dailyplans.ts
  ↓
Model: server/models/DailyPlan.ts (IDailyPlan interface)
  ↓
MongoDB Atlas: db.dailyplans
  └─ Fields: _id, userId, date, morning, afternoon, evening,
             notes, focus, intentions
```

**Purpose:** Daily planning and tracking

---

### HEALTHTRACKER Collection
```
Frontend: HealthTracker.tsx / HealthTrackerComponent.tsx
  ↓
API Endpoint: /api/health
  ↓
Backend Route: server/routes/health.ts
  ↓
Model: server/models/HealthTracker.ts (IHealthTracker interface)
  ↓
MongoDB Atlas: db.healthtrackers
  └─ Fields: _id, userId, date, weight, bloodPressure, sleepHours,
             mood, energyLevel, hydration, steps, water, sleep,
             exercise, notes
```

**Purpose:** Health and wellness tracking

---

### WORKSHOPS Collection
```
Frontend: WorkshopsPage.tsx
  ↓
API Endpoint: /api/admin/workshops
  ↓
Backend Route: server/routes/workshops.ts
  ↓
Model: server/models/Workshop.ts (IWorkshop interface)
  ↓
MongoDB Atlas: db.workshops
  └─ Fields: _id, title, instructor, description, startDate, endDate,
             duration, startTime, endTime, category, mode, language,
             level, maxParticipants, enrolledCount, rating, price,
             isPublic, enrolledUsers
```

**Purpose:** Online and offline courses/workshops

---

### USERS Collection
```
Frontend: SignUp/SignIn Pages
  ↓
API Endpoint: /api/users
  ↓
Backend Route: server/routes/users.ts
  ↓
Model: server/models/User.ts (IUser interface)
  ↓
MongoDB Atlas: db.users
  └─ Fields: _id, email, password (hashed), name, phone, countryCode,
             country, state, gender, age, profession, registrationDate,
             lastLogin, isActive
```

**Purpose:** User accounts and authentication

---

### SIGNUPDATA Collection
```
Frontend: SignUpPage.tsx
  ↓
API Endpoint: /api/auth/register or /api/admin/signup-data
  ↓
Backend Route: server/routes/users.ts or server/routes/adminMongo.ts
  ↓
Model: server/models/SignupData.ts (ISignupData interface)
  ↓
MongoDB Atlas: db.signupdatas
  └─ Fields: _id, email, name, phone, countryCode, country, state,
             gender, age, profession, registrationDate, source
```

**Purpose:** Track all user registrations and sources

---

### SIGNINDATA Collection
```
Frontend: SignInPage.tsx
  ↓
API Endpoint: /api/auth/login or /api/admin/signin-data
  ↓
Backend Route: server/routes/users.ts or server/routes/adminMongo.ts
  ↓
Model: server/models/SigninData.ts (ISigninData interface)
  ↓
MongoDB Atlas: db.signindatas
  └─ Fields: _id, email, name, loginDate, ipAddress, userAgent,
             loginTime, sessionDuration, success
```

**Purpose:** Track login history and user sessions

---

### CONTACTS Collection
```
Frontend: ContactPage.tsx
  ↓
API Endpoint: /api/contact/messages
  ↓
Backend Route: server/routes/contact.ts
  ↓
Model: server/models/Contact.ts (IContact interface)
  ↓
MongoDB Atlas: db.contacts
  └─ Fields: _id, name, email, phone, subject, message,
             submissionDate, status, category, response
```

**Purpose:** Store contact form submissions

---

### CARTS Collection
```
Frontend: (E-commerce features)
  ↓
API Endpoint: /api/carts
  ↓
Backend Route: server/routes/carts.ts
  ↓
Model: server/models/Cart.ts (ICart interface)
  ↓
MongoDB Atlas: db.carts
  └─ Fields: _id, userId, items, itemCount, totalPrice,
             currency, createdAt, updatedAt, status
```

**Purpose:** Shopping cart for courses/products

---

### ADMINS Collection
```
Frontend: AdminSignIn.tsx / AdminSignUp.tsx
  ↓
API Endpoint: /api/admin/signin or /api/admin/signup
  ↓
Backend Route: server/routes/admin.ts
  ↓
Model: server/models/Admin.ts (IAdmin interface)
  ↓
MongoDB Atlas: db.admins
  └─ Fields: _id, email, password (hashed), name, role,
             permissions, createdAt, lastLogin, isActive
```

**Purpose:** Admin account management

---

## 🔗 Data Relationships Diagram

```
                    VISIONS
                      ↑
                      │ (linkedVisionId)
                      │
                    GOALS ←─────┐
                      ↑         │
                      │         │ (linkedGoalId)
                      │         │
                    TASKS ──→ REMINDERS
                      ↓
                  MILESTONES

            MYWORDS ─────────┐
            TODOS           │ (User profile)
            DAILYPLANS      │
            HEALTHTRACKER ──┤
            WORKSHOPS       │
            USERS ──────────┤
            SIGNUPDATA      │
            SIGNINDATA      │
            CONTACTS ───────┤
            CARTS ──────────┤
            ADMINS ─────────┘
```

---

## 📈 Data Flow Summary

```
User Action → Frontend Component → HTTP Request → Express Route → Mongoose Model → MongoDB Atlas
```

### Example: Create a Task
```
1. User fills TasksComponent form
2. Click "Add Task" button
3. Frontend calls: taskAPI.create({title, description, ...})
4. Axios POST to: http://localhost:3001/api/tasks
5. Express route handler receives request
6. Validates input
7. Creates new Task model instance
8. Calls: Task.create({...})
9. Mongoose saves to MongoDB Atlas
10. MongoDB returns _id and document
11. Response sent to frontend
12. Task appears in UI
```

---

## ✅ Verification Indicators

**All collections verified as MongoDB storage:**

- [x] All models use Mongoose (`mongoose.model()`)
- [x] All routes use `import Model from '../models/'`
- [x] Database connection uses `MONGODB_URI`
- [x] No file-based primary storage for core data
- [x] Backups are snapshots extracted FROM MongoDB
- [x] No alternative database fallback in production

---

## 🚀 Performance Considerations

### Indexing Strategy
- `userId` indexed on all user-specific collections
- Composite indexes on frequently queried field combinations
- Example: `db.tasks.index({ userId: 1, status: 1, dueDate: 1 })`

### Query Optimization
- Queries filter by `userId` to isolate user data
- Pagination implemented in list endpoints
- Lean queries used where projection needed

### Backup Performance
- Daily backups scheduled during low-traffic hours
- Incremental backups to reduce storage
- Retention: Last 10 days maintained

---

## 🎯 Conclusion

**All 16 collections securely stored in MongoDB Atlas with:**
✅ Proper indexing  
✅ User data isolation  
✅ Audit logging  
✅ Backup snapshots  
✅ Production-ready configuration  

**Your data architecture is solid!** 🎉

