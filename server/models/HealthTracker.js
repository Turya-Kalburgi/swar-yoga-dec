import mongoose from 'mongoose';

const healthTrackerSchema = new mongoose.Schema({
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
  
  // Core health metrics
  water: { 
    type: Number, 
    default: 0 
  }, // in glasses
  sleep: { 
    type: Number, 
    default: 0 
  }, // in hours
  exercise: { 
    type: Number, 
    default: 0 
  }, // in minutes
  meals: { 
    type: Number, 
    default: 0 
  }, // healthy meals count
  
  // Additional health data
  steps: { 
    type: Number, 
    default: 0 
  },
  weight: { 
    type: Number 
  }, // in kg
  calories: { 
    type: Number 
  }, // in kcal
  heartRate: { 
    type: Number 
  }, // in bpm
  bloodPressure: { 
    type: String 
  }, // systolic/diastolic format
  
  // Wellness indicators
  mood: { 
    type: String, 
    enum: ['terrible', 'bad', 'neutral', 'good', 'great'],
    default: 'neutral'
  },
  energyLevel: { 
    type: Number, 
    min: 1, 
    max: 10, 
    default: 5 
  },
  stressLevel: { 
    type: Number, 
    min: 1, 
    max: 10, 
    default: 5 
  },
  
  // Activity tracking
  meditationMinutes: { 
    type: Number, 
    default: 0 
  },
  yogaMinutes: { 
    type: Number, 
    default: 0 
  },
  
  // Additional info
  notes: { 
    type: String 
  },
  
  // Reminders
  reminder: { 
    type: Boolean, 
    default: false 
  },
  reminderTime: { 
    type: String 
  }, // HH:MM format
  
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
healthTrackerSchema.index({ userId: 1, date: 1 });
healthTrackerSchema.index({ userId: 1, mood: 1 });
healthTrackerSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('HealthTracker', healthTrackerSchema);
