import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const signinDataSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => uuidv4() },
    email: { type: String, required: true, lowercase: true, trim: true },
    name: { type: String, default: null },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, enum: ['success', 'failed'], default: 'failed' },
    ip: { type: String, default: 'unknown' },
    device: { type: String, default: 'unknown' },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

// Index for faster queries
signinDataSchema.index({ email: 1, timestamp: -1 });

const SigninData = mongoose.model('SigninData', signinDataSchema);

export default SigninData;
