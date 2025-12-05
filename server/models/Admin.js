import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const adminSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => uuidv4() },
    adminId: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['superadmin', 'admin', 'moderator', 'support'], default: 'admin' },
    permissions: [{ type: String, enum: ['manage_users', 'manage_workshops', 'manage_orders', 'manage_contacts', 'manage_admins', 'view_analytics', 'view_reports', 'manage_settings'] }],
    accountStatus: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
    lastLogin: { type: Date, default: null },
    loginCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: () => new Date() },
    createdBy: { type: String, default: 'system' },
    loginHistory: [{
      date: { type: Date, default: () => new Date() },
      ipAddress: String,
      userAgent: String,
      device: String,
      browser: String,
      status: { type: String, enum: ['success', 'failed'], default: 'success' }
    }],
    metadata: {
      department: String,
      phoneNumber: String,
      lastPasswordChange: Date,
      twoFactorEnabled: { type: Boolean, default: false },
      allowedIPs: [String]
    }
  },
  { timestamps: true, collection: 'admins' }
);

// Create indexes using schema.index() method
adminSchema.index({ adminId: 1 });
adminSchema.index({ email: 1 });
adminSchema.index({ role: 1, accountStatus: 1 });
adminSchema.index({ lastLogin: -1 });

export default mongoose.model('Admin', adminSchema);
