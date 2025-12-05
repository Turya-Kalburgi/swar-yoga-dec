import express from 'express';
import crypto from 'crypto';
import Admin from '../models/Admin.js';
import Contact from '../models/Contact.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// ===== UTILITY FUNCTIONS =====

// Hash password with salt
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

// Verify password
function verifyPassword(password, storedHash) {
  const [salt, hash] = storedHash.split(':');
  const hashVerify = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === hashVerify;
}

// Generate admin userId from email
function generateAdminUserId(email) {
  const normalized = email.toLowerCase();
  return Buffer.from(normalized).toString('base64').replace(/=/g, '').substring(0, 20);
}

// ===== ADMIN SIGNIN =====
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const normalizedEmail = email.toLowerCase();
    const admin = await Admin.findOne({ email: normalizedEmail });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (admin.accountStatus !== 'active') {
      return res.status(403).json({
        success: false,
        message: `Account is ${admin.accountStatus}. Contact support.`
      });
    }

    // Verify password
    if (!verifyPassword(password, admin.passwordHash)) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Log signin activity
    admin.loginHistory.push({
      date: new Date(),
      ipAddress: req.ip || 'unknown',
      userAgent: req.get('user-agent') || 'unknown',
      device: req.body.deviceType || 'web',
      browser: req.body.browser || 'unknown',
      status: 'success'
    });

    admin.lastLogin = new Date();
    admin.loginCount += 1;
    await admin.save();

    console.log(`✅ Admin signin: ${email} (ID: ${admin.adminId})`);

    const adminData = {
      id: generateAdminUserId(email),
      adminId: admin.adminId,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      permissions: admin.permissions,
      accountStatus: admin.accountStatus,
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'Admin signin successful',
      admin: adminData
    });
  } catch (error) {
    console.error('❌ Admin signin error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Signin failed',
      error: error.message
    });
  }
});

// ===== ADMIN SIGNUP =====
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name, role = 'admin' } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and name are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const normalizedEmail = email.toLowerCase();

    // Check if email already exists
    const existingAdmin = await Admin.findOne({ email: normalizedEmail });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create new admin
    const adminId = generateAdminUserId(normalizedEmail);
    const newAdmin = new Admin({
      adminId,
      email: normalizedEmail,
      name,
      passwordHash: hashPassword(password),
      role,
      permissions: role === 'superadmin' ? ['manage_users', 'manage_workshops', 'manage_orders', 'manage_contacts', 'manage_admins', 'view_analytics', 'view_reports', 'manage_settings'] : ['manage_workshops', 'manage_contacts'],
      accountStatus: 'active',
      loginHistory: [{
        date: new Date(),
        ipAddress: req.ip || 'unknown',
        userAgent: req.get('user-agent') || 'unknown',
        device: req.body.deviceType || 'web',
        browser: req.body.browser || 'unknown',
        status: 'success'
      }]
    });

    await newAdmin.save();

    console.log(`✅ New admin registered: ${email} (ID: ${adminId})`);

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      admin: {
        id: adminId,
        adminId: newAdmin.adminId,
        email: newAdmin.email,
        name: newAdmin.name,
        role: newAdmin.role
      }
    });
  } catch (error) {
    console.error('❌ Admin signup error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Signup failed',
      error: error.message
    });
  }
});

// ===== GET ADMIN PROFILE =====
router.get('/profile/:adminId', async (req, res) => {
  try {
    const { adminId } = req.params;

    const admin = await Admin.findOne({ adminId });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    const adminData = {
      id: adminId,
      adminId: admin.adminId,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      permissions: admin.permissions,
      accountStatus: admin.accountStatus,
      lastLogin: admin.lastLogin,
      loginCount: admin.loginCount,
      createdAt: admin.createdAt
    };

    res.json({
      success: true,
      data: adminData
    });
  } catch (error) {
    console.error('❌ Error fetching admin profile:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
});

// ===== UPDATE ADMIN PROFILE =====
router.put('/profile/:adminId', async (req, res) => {
  try {
    const { adminId } = req.params;
    const updates = req.body;

    // Remove sensitive fields
    delete updates.adminId;
    delete updates.email;
    delete updates.passwordHash;
    delete updates.accountStatus;
    delete updates.loginCount;

    const admin = await Admin.findOne({ adminId });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Update allowed fields
    if (updates.name) admin.name = updates.name;
    if (updates.metadata) admin.metadata = { ...admin.metadata, ...updates.metadata };

    await admin.save();

    console.log(`✅ Admin profile updated: ${adminId}`);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: adminId,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('❌ Error updating profile:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
});

// ===== CHANGE PASSWORD =====
router.post('/change-password/:adminId', async (req, res) => {
  try {
    const { adminId } = req.params;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Old password and new password are required'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const admin = await Admin.findOne({ adminId });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Verify old password
    if (!verifyPassword(oldPassword, admin.passwordHash)) {
      return res.status(401).json({
        success: false,
        message: 'Old password is incorrect'
      });
    }

    admin.passwordHash = hashPassword(newPassword);
    admin.metadata.lastPasswordChange = new Date();
    await admin.save();

    console.log(`✅ Admin password changed: ${adminId}`);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('❌ Error changing password:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error changing password',
      error: error.message
    });
  }
});

// ===== CREATE NEW ADMIN =====
router.post('/create', async (req, res) => {
  try {
    const { email, password, name, role = 'admin' } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and name are required'
      });
    }

    const normalizedEmail = email.toLowerCase();

    // Check if email already exists
    const existingAdmin = await Admin.findOne({ email: normalizedEmail });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create new admin
    const adminId = generateAdminUserId(normalizedEmail);
    const newAdmin = new Admin({
      adminId,
      email: normalizedEmail,
      name,
      passwordHash: hashPassword(password),
      role,
      permissions: role === 'superadmin' ? ['manage_users', 'manage_workshops', 'manage_orders', 'manage_contacts', 'manage_admins', 'view_analytics', 'view_reports', 'manage_settings'] : ['manage_workshops', 'manage_contacts'],
      accountStatus: 'active'
    });

    await newAdmin.save();

    console.log(`✅ New admin created: ${email} (ID: ${adminId})`);

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      data: {
        id: adminId,
        email: newAdmin.email,
        name: newAdmin.name,
        role: newAdmin.role
      }
    });
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error creating admin',
      error: error.message
    });
  }
});

// ===== GET ALL ADMINS =====
router.get('/all', async (req, res) => {
  try {
    const admins = await Admin.find({}, '-passwordHash').lean();

    res.json({
      success: true,
      count: admins.length,
      data: admins
    });
  } catch (error) {
    console.error('❌ Error fetching admins:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching admins',
      error: error.message
    });
  }
});

// ===== DEACTIVATE ADMIN =====
router.post('/deactivate/:adminId', async (req, res) => {
  try {
    const { adminId } = req.params;

    const admin = await Admin.findOne({ adminId });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    admin.accountStatus = 'inactive';
    await admin.save();

    console.log(`✅ Admin deactivated: ${adminId}`);

    res.json({
      success: true,
      message: 'Admin deactivated successfully'
    });
  } catch (error) {
    console.error('❌ Error deactivating admin:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error deactivating admin',
      error: error.message
    });
  }
});

// ===== CONTACT MESSAGES (moved from admin endpoint) =====

// Get all contact messages
router.get('/contact/messages', async (req, res) => {
  try {
    const { status, priority, limit = 100, skip = 0 } = req.query;

    let query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const messages = await Contact.find(query)
      .sort({ submittedAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .lean();

    const total = await Contact.countDocuments(query);

    res.json({
      success: true,
      count: messages.length,
      total,
      messages
    });
  } catch (error) {
    console.error('❌ Error fetching contact messages:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages',
      error: error.message
    });
  }
});

// Get single contact message
router.get('/contact/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Contact.findOne({
      $or: [{ contactId: id }, { _id: id }]
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('❌ Error fetching contact message:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching message',
      error: error.message
    });
  }
});

// Update contact message status/reply
router.put('/contact/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, replyMessage, assignedTo } = req.body;

    const message = await Contact.findOne({
      $or: [{ contactId: id }, { _id: id }]
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    if (status) message.status = status;
    if (priority) message.priority = priority;
    if (replyMessage) {
      message.replyMessage = replyMessage;
      message.repliedAt = new Date();
      message.status = 'replied';
    }
    if (assignedTo) message.assignedTo = assignedTo;

    await message.save();

    console.log(`✅ Contact message updated: ${id}`);

    res.json({
      success: true,
      message: 'Message updated successfully',
      data: message
    });
  } catch (error) {
    console.error('❌ Error updating contact message:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error updating message',
      error: error.message
    });
  }
});

// Delete contact message
router.delete('/contact/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Contact.findOneAndDelete({
      $or: [{ contactId: id }, { _id: id }]
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    console.log(`✅ Contact message deleted: ${id}`);

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting contact message:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error deleting message',
      error: error.message
    });
  }
});

// ===== ADMIN SIGNOUT =====
router.post('/signout', async (req, res) => {
  try {
    const { adminId } = req.body;

    if (!adminId) {
      return res.status(400).json({
        success: false,
        message: 'adminId is required'
      });
    }

    const admin = await Admin.findOne({ adminId });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    console.log(`✅ Admin signed out: ${adminId}`);

    res.json({
      success: true,
      message: 'Admin signed out successfully'
    });
  } catch (error) {
    console.error('❌ Admin signout error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Signout failed',
      error: error.message
    });
  }
});

export default router;
