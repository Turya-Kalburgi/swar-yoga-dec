import express from 'express';
import crypto from 'crypto';
import { query } from '../mysqlAdmin.js';

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

// Generate admin userId from email (same pattern as regular users)
function generateAdminUserId(email) {
  return Buffer.from(email).toString('base64').replace(/=/g, '').substring(0, 20);
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

    // Find admin user
    const results = await query(
      'SELECT * FROM admin_users WHERE email = ?',
      [email]
    );

    if (results.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    const admin = results[0];

    // Check if account is active
    if (admin.status !== 'active') {
      return res.status(403).json({ 
        success: false, 
        message: `Account is ${admin.status}. Contact support.` 
      });
    }

    // Verify password
    if (!verifyPassword(password, admin.password_hash)) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Log signin activity
    await query(
      `INSERT INTO admin_signin_logs 
       (admin_id, email, ip_address, user_agent, device_type, browser, login_timestamp, session_status)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), 'active')`,
      [
        admin.id,
        email,
        req.ip || 'unknown',
        req.headers['user-agent'] || '',
        req.body.deviceType || 'web',
        req.body.browser || 'unknown'
      ]
    );

    // Update last login
    await query(
      'UPDATE admin_users SET last_login = NOW() WHERE id = ?',
      [admin.id]
    );

    // Return admin data with stable userId
    const adminData = {
      id: generateAdminUserId(email),
      adminId: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      timestamp: new Date().toISOString()
    };

    console.log(`✅ Admin signin: ${email} (ID: ${admin.id})`);

    res.json({
      success: true,
      message: 'Admin signin successful',
      admin: adminData
    });
  } catch (error) {
    console.error('❌ Admin signin error:', error);
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

    // Check if email already exists
    const existingAdmin = await query(
      'SELECT id FROM admin_users WHERE email = ?',
      [email]
    );

    if (existingAdmin.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered' 
      });
    }

    // Hash password
    const passwordHash = hashPassword(password);

    // Insert new admin
    const result = await query(
      `INSERT INTO admin_users (email, password_hash, name, role, status, created_at)
       VALUES (?, ?, ?, ?, 'active', NOW())`,
      [email, passwordHash, name, role]
    );

    const adminId = result.insertId;

    // Log activity
    await query(
      `INSERT INTO admin_activity_logs (admin_id, action, resource_type, details, timestamp)
       VALUES (?, 'SIGNUP', 'admin_user', ?, NOW())`,
      [adminId, JSON.stringify({ email, name, role })]
    );

    console.log(`✅ New admin registered: ${email} (ID: ${adminId})`);

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      admin: {
        id: generateAdminUserId(email),
        adminId,
        email,
        name,
        role
      }
    });
  } catch (error) {
    console.error('❌ Admin signup error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Signup failed', 
      error: error.message 
    });
  }
});

// ===== ADMIN LOGOUT / SIGNOUT =====
router.post('/signout', async (req, res) => {
  try {
    const { adminId, email } = req.body;

    if (!adminId && !email) {
      return res.status(400).json({ 
        success: false, 
        message: 'adminId or email is required' 
      });
    }

    let whereClause, params;
    if (adminId) {
      whereClause = 'WHERE admin_id = ?';
      params = [adminId];
    } else {
      whereClause = 'WHERE email = ?';
      params = [email];
    }

    // Update logout timestamp for active sessions
    await query(
      `UPDATE admin_signin_logs 
       SET logout_timestamp = NOW(), session_status = 'inactive'
       WHERE session_status = 'active' ${whereClause}`,
      params
    );

    console.log(`✅ Admin signed out: ${email || adminId}`);

    res.json({
      success: true,
      message: 'Admin signed out successfully'
    });
  } catch (error) {
    console.error('❌ Admin signout error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Signout failed', 
      error: error.message 
    });
  }
});

// ===== CONTACT MESSAGES =====

// Get all contact messages
router.get('/contact/messages', async (req, res) => {
  try {
    const status = req.query.status;
    const priority = req.query.priority;

    let sql = 'SELECT * FROM contact_messages WHERE 1=1';
    const params = [];

    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (priority) {
      sql += ' AND priority = ?';
      params.push(priority);
    }

    sql += ' ORDER BY submitted_at DESC LIMIT 1000';

    const messages = await query(sql, params);

    res.json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    console.error('❌ Error fetching contact messages:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch messages', 
      error: error.message 
    });
  }
});

// Create contact message
router.post('/contact/messages', async (req, res) => {
  try {
    const { name, email, countryCode, whatsapp, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and message are required' 
      });
    }

    const result = await query(
      `INSERT INTO contact_messages 
       (name, email, country_code, whatsapp, subject, message, ip_address, user_agent, submitted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        name,
        email,
        countryCode || '+91',
        whatsapp || '',
        subject || '',
        message,
        req.ip || 'unknown',
        req.headers['user-agent'] || ''
      ]
    );

    console.log(`✅ Contact message received from: ${email}`);

    res.status(201).json({
      success: true,
      message: 'Message received successfully',
      messageId: result.insertId
    });
  } catch (error) {
    console.error('❌ Error creating contact message:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to save message', 
      error: error.message 
    });
  }
});

// Update contact message status
router.put('/contact/messages/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, replyMessage, assignedTo } = req.body;

    let updateFields = [];
    let params = [];

    if (status) {
      updateFields.push('status = ?');
      params.push(status);

      if (status === 'replied' && replyMessage) {
        updateFields.push('reply_message = ?');
        updateFields.push('replied_at = NOW()');
        params.push(replyMessage);
      }
    }

    if (priority) {
      updateFields.push('priority = ?');
      params.push(priority);
    }

    if (assignedTo) {
      updateFields.push('assigned_to = ?');
      params.push(assignedTo);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No fields to update' 
      });
    }

    params.push(id);

    await query(
      `UPDATE contact_messages SET ${updateFields.join(', ')} WHERE id = ?`,
      params
    );

    console.log(`✅ Contact message ${id} updated`);

    res.json({
      success: true,
      message: 'Message updated successfully'
    });
  } catch (error) {
    console.error('❌ Error updating contact message:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update message', 
      error: error.message 
    });
  }
});

// ===== SIGNIN LOGS =====

// Get signin logs
router.get('/signin/logs', async (req, res) => {
  try {
    const adminId = req.query.adminId;
    const limit = parseInt(req.query.limit) || 100;

    let sql = 'SELECT * FROM admin_signin_logs WHERE 1=1';
    const params = [];

    if (adminId) {
      sql += ' AND admin_id = ?';
      params.push(adminId);
    }

    sql += ' ORDER BY login_timestamp DESC LIMIT ?';
    params.push(limit);

    const logs = await query(sql, params);

    res.json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (error) {
    console.error('❌ Error fetching signin logs:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch logs', 
      error: error.message 
    });
  }
});

// ===== SIGNUP USERS (managed by admin) =====

// Get all signup users
router.get('/users/signup', async (req, res) => {
  try {
    const status = req.query.status;
    const source = req.query.source;
    const limit = parseInt(req.query.limit) || 1000;

    let sql = 'SELECT * FROM signup_users WHERE 1=1';
    const params = [];

    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (source) {
      sql += ' AND source = ?';
      params.push(source);
    }

    sql += ' ORDER BY registration_date DESC LIMIT ?';
    params.push(limit);

    const users = await query(sql, params);

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('❌ Error fetching signup users:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch users', 
      error: error.message 
    });
  }
});

// Add signup user (manually)
router.post('/users/signup', async (req, res) => {
  try {
    const { name, email, phone, countryCode, country, state, gender, age, profession } = req.body;

    if (!name || !email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name and email are required' 
      });
    }

    const result = await query(
      `INSERT INTO signup_users 
       (name, email, phone, country_code, country, state, gender, age, profession, source, status, registration_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'manual', 'active', NOW())`,
      [name, email, phone || '', countryCode || '+91', country || 'India', state || '', gender || 'other', age || 0, profession || '']
    );

    console.log(`✅ Signup user added: ${email}`);

    res.status(201).json({
      success: true,
      message: 'User added successfully',
      userId: result.insertId
    });
  } catch (error) {
    console.error('❌ Error adding signup user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to add user', 
      error: error.message 
    });
  }
});

// Update signup user
router.put('/users/signup/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    let updateFields = [];
    let params = [];

    if (status) {
      updateFields.push('status = ?');
      params.push(status);
    }

    if (notes) {
      updateFields.push('notes = ?');
      params.push(notes);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No fields to update' 
      });
    }

    params.push(id);

    await query(
      `UPDATE signup_users SET ${updateFields.join(', ')} WHERE id = ?`,
      params
    );

    console.log(`✅ Signup user ${id} updated`);

    res.json({
      success: true,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('❌ Error updating signup user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update user', 
      error: error.message 
    });
  }
});

export default router;
