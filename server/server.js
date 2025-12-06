import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import workshopRoutes from './routes/workshops.js';
import adminRoutes from './routes/admin.js';
import visionRoutes from './routes/visions.js';
import goalRoutes from './routes/goals.js';
import taskRoutes from './routes/tasks.js';
import todoRoutes from './routes/todos.js';
import mywordRoutes from './routes/mywords.js';
import healthRoutes from './routes/health.js';
import userRoutes from './routes/users.js';
import cartRoutes from './routes/carts.js';
import adminMongoRoutes from './routes/adminMongo.js';
import contactRoutes from './routes/contact.js';
import milestoneRoutes from './routes/milestones.js';
import reminderRoutes from './routes/reminders.js';
import dailyPlanRoutes from './routes/dailyplans.js';
import connectDB from './config/db.js';
import { 
  createDailyBackup, 
  listBackups, 
  restoreFromBackup, 
  getBackupStats 
} from './backup.js';
import { 
  createSignoutBackup, 
  createManualBackup, 
  listBackups as listAdminBackups, 
  getBackupStats as getAdminBackupStats 
} from './adminBackup.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Initialize MongoDB connection
(async () => {
  try {
    await connectDB();
    console.log('✅ MongoDB initialization successful');
  } catch (error) {
    console.error('❌ MongoDB initialization failed:', error.message);
  }
})();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Root endpoint for testing
app.get('/', (req, res) => {
  res.json({ message: 'Swar Yoga Backend API - Running on Render', timestamp: new Date().toISOString() });
});

// ⭐ IMPORTANT: Workshop Routes MUST come FIRST before generic routes
// Otherwise the generic routes will catch them!
app.use('/api/admin/workshops', workshopRoutes);

// ===== MONGODB ROUTES =====
app.use('/api/visions', visionRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/mywords', mywordRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/dailyplans', dailyPlanRoutes);


// ===== MONGODB USER & CART ROUTES =====
app.use('/api/users', userRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/admin-mongo', adminMongoRoutes);
// ===== ADMIN SYSTEM ROUTES =====
app.use('/api/admin', adminRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/contact', contactRoutes);

// ===== BACKUP SYSTEM ENDPOINTS =====
// Create daily backup
app.post('/api/admin/backup/create', async (req, res) => {
  try {
    const result = await createDailyBackup();
    if (result.success) {
      res.json({ success: true, message: 'Daily backup created', ...result });
    } else {
      res.json({ success: false, reason: result.reason });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to create backup', message: error.message });
  }
});

// List all backups
app.get('/api/admin/backup/list', async (req, res) => {
  try {
    const backups = await listBackups();
    res.json({ success: true, backups });
  } catch (error) {
    res.status(500).json({ error: 'Failed to list backups', message: error.message });
  }
});

// Get backup statistics
app.get('/api/admin/backup/stats', async (req, res) => {
  try {
    const stats = await getBackupStats();
    res.json({ success: true, ...stats });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get backup stats', message: error.message });
  }
});

// Restore from backup
app.post('/api/admin/backup/restore', async (req, res) => {
  try {
    const { backupFilename } = req.body;
    
    if (!backupFilename) {
      return res.status(400).json({ error: 'backupFilename is required' });
    }
    
    const result = await restoreFromBackup(backupFilename);
    
    if (result.success) {
      res.json({ success: true, message: 'Backup restored successfully', ...result });
    } else {
      res.status(400).json({ success: false, error: result.error });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to restore backup', message: error.message });
  }
});

// ========================================
// ✅ MONGODB ONLY - ALL DATA GOES TO CLOUD
// ========================================

import User from './models/User.js';
import SignupData from './models/SignupData.js';
import SigninData from './models/SigninData.js';

// Health / test endpoint
app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: Date.now(), database: 'MongoDB Atlas' });
});

// ===== USER AUTH ROUTES (MONGODB ONLY) =====

// Register user (save to MongoDB)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, phone, countryCode, country, state, gender, age, profession } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Create new user
    const newUser = new User({
      userId: email.toLowerCase(),
      email: email.toLowerCase(),
      password,
      name: name || email.split('@')[0],
      phone,
      countryCode,
      country,
      state,
      gender,
      age,
      isNewUser: true,
      registrationDate: new Date().toISOString()
    });

    await newUser.save();
    console.log(`✅ User registered: ${email}`);

    // Also record signup data
    const signupData = new SignupData({
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      countryCode: newUser.countryCode,
      country: newUser.country,
      state: newUser.state,
      gender: newUser.gender,
      age: newUser.age,
      profession: profession || '',
      registrationDate: new Date().toISOString(),
      status: 'active',
      source: 'signup'
    });

    await signupData.save();

    res.status(201).json({
      id: newUser.userId,
      email: newUser.email,
      name: newUser.name,
      message: 'Registration successful'
    });
  } catch (error) {
    console.error('❌ Registration error:', error.message);
    res.status(500).json({ error: 'Registration failed', message: error.message });
  }
});

// Login user (verify against MongoDB)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user in MongoDB
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || user.password !== password) {
      // Record failed signin
      const signinData = new SigninData({
        email: email.toLowerCase(),
        timestamp: new Date().toISOString(),
        status: 'failed',
        ip: req.ip || 'unknown',
        device: req.headers['user-agent'] || 'unknown'
      });
      await signinData.save();

      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Record successful signin
    const signinData = new SigninData({
      email: user.email,
      name: user.name,
      timestamp: new Date().toISOString(),
      status: 'success',
      ip: req.ip || 'unknown',
      device: req.headers['user-agent'] || 'unknown'
    });
    await signinData.save();

    console.log(`✅ User logged in: ${email}`);

    res.json({
      id: user.userId,
      email: user.email,
      name: user.name,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('❌ Login error:', error.message);
    res.status(500).json({ error: 'Login failed', message: error.message });
  }
});

// Record signup data (fallback endpoint if needed)
app.post('/api/auth/record-signup', async (req, res) => {
  try {
    const signupData = new SignupData({
      ...req.body,
      registrationDate: new Date().toISOString(),
      status: 'active',
      source: 'signup'
    });

    await signupData.save();
    console.log(`✅ Signup recorded: ${req.body.email}`);
    res.json(signupData);
  } catch (error) {
    console.error('❌ Signup record error:', error.message);
    res.status(500).json({ error: 'Failed to record signup', message: error.message });
  }
});

// Record signin data (fallback endpoint if needed)
app.post('/api/auth/record-signin', async (req, res) => {
  try {
    const signinData = new SigninData({
      email: req.body.email,
      name: req.body.name || '',
      timestamp: new Date().toISOString(),
      status: req.body.success ? 'success' : 'failed',
      ip: req.ip || 'unknown',
      device: req.body.device || req.headers['user-agent'] || 'unknown'
    });

    await signinData.save();
    console.log(`✅ Signin recorded: ${req.body.email}`);
    res.json(signinData);
  } catch (error) {
    console.error('❌ Signin record error:', error.message);
    res.status(500).json({ error: 'Failed to record signin', message: error.message });
  }
});

// Admin: Get all signup data
app.get('/api/admin/signup-data', async (req, res) => {
  try {
    const signupData = await SignupData.find().sort({ registrationDate: -1 });
    res.json(signupData);
  } catch (error) {
    console.error('❌ Error fetching signup data:', error.message);
    res.status(500).json({ error: 'Failed to fetch signup data', message: error.message });
  }
});

// Admin: Get all signin data
app.get('/api/admin/signin-data', async (req, res) => {
  try {
    const signinData = await SigninData.find().sort({ timestamp: -1 }).limit(1000);
    res.json(signinData);
  } catch (error) {
    console.error('❌ Error fetching signin data:', error.message);
    res.status(500).json({ error: 'Failed to fetch signin data', message: error.message });
  }
});

app.listen(PORT, async () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
  console.log(`📊 Database: MongoDB Atlas (swaryogadb)`);
  
  // Create daily backup on server startup
  console.log('\n🔄 Attempting to create daily backup...');
  const backupResult = await createDailyBackup();
  if (backupResult.success) {
    console.log('✅ Daily backup created:', backupResult.filename);
  } else if (backupResult.reason === 'Already backed up today') {
    console.log('ℹ️  Backup already exists for today');
  } else {
    console.log('⚠️  Backup status:', backupResult.reason || backupResult.error);
  }
  console.log('');
});

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path, method: req.method });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});
