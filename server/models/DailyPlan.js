import mongoose from 'mongoose';

const dailyPlanSchema = new mongoose.Schema({
  // User and date identification
  userId: { 
    type: String, 
    required: true, 
    index: true 
  },
  date: { 
    type: String, 
    required: true 
  }, // YYYY-MM-DD format
  
  // Activity details
  time: { 
    type: String, 
    required: true 
  }, // HH:MM format
  activity: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  
  // Categorization
  category: { 
    type: String, 
    enum: ['work', 'health', 'personal', 'learning', 'spiritual', 'other'],
    default: 'personal'
  },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  
  // Duration and timing
  duration: { 
    type: Number, 
    default: 30 
  }, // in minutes
  reminder: { 
    type: Boolean, 
    default: false 
  },
  reminderTime: { 
    type: String 
  }, // HH:MM format
  
  // Status tracking
  completed: { 
    type: Boolean, 
    default: false 
  },
  completedAt: { 
    type: Date 
  },
  
  // Timestamps
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

// Compound indexes for optimal query performance
dailyPlanSchema.index({ userId: 1, date: 1 });
dailyPlanSchema.index({ userId: 1, completed: 1 });
dailyPlanSchema.index({ userId: 1, priority: 1 });
dailyPlanSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('DailyPlan', dailyPlanSchema);
