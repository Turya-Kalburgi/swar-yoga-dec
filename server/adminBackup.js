import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import SignupData from './models/SignupData.js';
import SigninData from './models/SigninData.js';
import Contact from './models/Contact.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BACKUPS_DIR = path.join(__dirname, '..', 'admin_backups');

// Ensure backups directory exists
async function ensureBackupDir() {
  try {
    await fs.mkdir(BACKUPS_DIR, { recursive: true });
  } catch (error) {
    console.error('❌ Failed to create backups directory:', error);
  }
}

ensureBackupDir();

/**
 * Create a backup when admin signs out
 * Backs up: contact messages, signin logs, signup users (from MongoDB)
 */
export async function createSignoutBackup(adminId, email) {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `admin_signout_${adminId}_${timestamp}.json`;
    const backupPath = path.join(BACKUPS_DIR, backupName);

    console.log(`📦 Creating signout backup for admin: ${email}`);

    // Fetch all data from MongoDB
    const [contactMessages, signinLogs, signupUsers] = await Promise.all([
      Contact.find().sort({ createdAt: -1 }),
      SigninData.find().sort({ timestamp: -1 }),
      SignupData.find().sort({ registrationDate: -1 })
    ]);

    const backupData = {
      backupType: 'signout',
      createdAt: new Date().toISOString(),
      createdBy: email,
      adminId,
      database: 'MongoDB Atlas',
      summary: {
        totalContactMessages: contactMessages.length,
        totalSigninLogs: signinLogs.length,
        totalSignupUsers: signupUsers.length
      },
      data: {
        contactMessages,
        signinLogs,
        signupUsers
      }
    };

    // Write backup to file
    await fs.writeFile(backupPath, JSON.stringify(backupData, null, 2), 'utf-8');

    console.log(`✅ Signout backup created: ${backupName}`);
    console.log(`   📊 Contact Messages: ${contactMessages.length}`);
    console.log(`   📊 Signin Logs: ${signinLogs.length}`);
    console.log(`   📊 Signup Users: ${signupUsers.length}`);

    return {
      success: true,
      backupName,
      backupPath,
      summary: backupData.summary
    };
  } catch (error) {
    console.error('❌ Error creating signout backup:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Create manual backup
 */
export async function createManualBackup(adminId, email) {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `admin_manual_${adminId}_${timestamp}.json`;
    const backupPath = path.join(BACKUPS_DIR, backupName);

    console.log(`📦 Creating manual backup by admin: ${email}`);

    // Fetch all data from MongoDB
    const [contactMessages, signinLogs, signupUsers] = await Promise.all([
      Contact.find().sort({ createdAt: -1 }),
      SigninData.find().sort({ timestamp: -1 }),
      SignupData.find().sort({ registrationDate: -1 })
    ]);

    const backupData = {
      backupType: 'manual',
      createdAt: new Date().toISOString(),
      createdBy: email,
      adminId,
      database: 'MongoDB Atlas',
      summary: {
        totalContactMessages: contactMessages.length,
        totalSigninLogs: signinLogs.length,
        totalSignupUsers: signupUsers.length
      },
      data: {
        contactMessages,
        signinLogs,
        signupUsers
      }
    };

    // Write backup to file
    await fs.writeFile(backupPath, JSON.stringify(backupData, null, 2), 'utf-8');

    console.log(`✅ Manual backup created: ${backupName}`);

    return {
      success: true,
      backupName,
      backupPath,
      summary: backupData.summary
    };
  } catch (error) {
    console.error('❌ Error creating manual backup:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * List all backups
 */
export async function listBackups() {
  try {
    const backups = await query(
      'SELECT * FROM data_backups ORDER BY backup_timestamp DESC LIMIT 100',
      []
    );

    return backups;
  } catch (error) {
    console.error('❌ Error listing backups:', error);
    throw error;
  }
}

/**
 * Get backup statistics
 */
export async function getBackupStats() {
  try {
    const stats = await query(
      `SELECT 
        COUNT(*) as total_backups,
        SUM(CASE WHEN backup_type = 'signout' THEN 1 ELSE 0 END) as signout_backups,
        SUM(CASE WHEN backup_type = 'manual' THEN 1 ELSE 0 END) as manual_backups,
        MAX(backup_timestamp) as latest_backup
      FROM data_backups WHERE status = 'completed'`,
      []
    );

    return stats[0] || {};
  } catch (error) {
    console.error('❌ Error getting backup stats:', error);
    throw error;
  }
}

/**
 * Restore from backup
 */
export async function restoreFromBackup(backupName, adminId) {
  try {
    console.log(`🔄 Restoring from backup: ${backupName}`);

    const backupPath = path.join(BACKUPS_DIR, backupName);

    // Check if file exists
    await fs.access(backupPath);

    // Read backup file
    const backupContent = await fs.readFile(backupPath, 'utf-8');
    const backupData = JSON.parse(backupContent);

    // Update backup record as restored
    await query(
      `UPDATE data_backups 
       SET restored_at = NOW(), restored_by = ?, status = 'completed'
       WHERE backup_name = ?`,
      [adminId, backupName]
    );

    console.log(`✅ Backup restored: ${backupName}`);

    return {
      success: true,
      message: 'Backup restored successfully',
      data: backupData
    };
  } catch (error) {
    console.error('❌ Error restoring backup:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Download backup file
 */
export async function getBackupFile(backupName) {
  try {
    const backupPath = path.join(BACKUPS_DIR, backupName);
    await fs.access(backupPath);
    return await fs.readFile(backupPath);
  } catch (error) {
    console.error('❌ Error reading backup file:', error);
    throw error;
  }
}
