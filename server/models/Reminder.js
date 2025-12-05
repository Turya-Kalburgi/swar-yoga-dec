import mongoose from 'mongoose';import mongoose from 'mongoose';

import { v4 as uuidv4 } from 'uuid';

const reminderSchema = new mongoose.Schema(

  {const reminderSchema = new mongoose.Schema(

    userId: {  {

      type: String,    _id: { type: String, default: () => uuidv4() },

      required: true,    userId: { type: String, required: true, index: true },

      index: true    

    },    // What this reminder is for

    title: {    reminderType: { type: String, enum: ['Milestone', 'Task', 'Todo', 'Goal', 'Vision', 'Custom'], default: 'Custom' },

      type: String,    relatedId: { type: String, default: '' }, // ID of Milestone/Task/Todo/Goal/Vision

      required: true,    relatedTitle: { type: String, default: '' }, // Display name

      trim: true    

    },    // Milestone connection

    description: {    milestoneId: { type: String, default: '' },

      type: String,    milestoneDueDate: { type: Date, default: null },

      default: ''    

    },    // Reminder details

    reminderDate: {    title: { type: String, required: true },

      type: String,    description: { type: String, default: '' },

      required: true    category: { type: String, default: '' },

    },    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium', index: true },

    reminderTime: {    

      type: String,    // Timing

      required: true,    reminderDate: { type: Date, required: true, index: true },

      default: '09:00'    reminderTime: { type: String, default: '09:00' }, // HH:MM format

    },    

    priority: {    // Recurrence

      type: String,    isRecurring: { type: Boolean, default: false },

      enum: ['Low', 'Medium', 'High'],    recurrencePattern: { type: String, enum: ['Daily', 'Weekly', 'Bi-weekly', 'Monthly', 'Quarterly', 'Yearly', 'Custom'], default: 'Daily' },

      default: 'Medium',    recurrenceEnd: { type: Date, default: null },

      index: true    

    },    // Notification channels

    category: {    notificationChannels: {

      type: String,      email: { type: Boolean, default: true },

      default: 'Personal'      inApp: { type: Boolean, default: true },

    },      sms: { type: Boolean, default: false },

    reminderType: {      whatsapp: { type: Boolean, default: false },

      type: String,      browser: { type: Boolean, default: true }

      enum: ['Todo', 'Task', 'Goal', 'Milestone', 'Custom'],    },

      default: 'Custom'    

    },    // Status

    relatedId: {    status: { type: String, enum: ['Active', 'Snoozed', 'Dismissed', 'Completed', 'Expired'], default: 'Active', index: true },

      type: String,    isCompleted: { type: Boolean, default: false },

      default: ''    completedAt: { type: Date, default: null },

    },    snoozedUntil: { type: Date, default: null },

    relatedTitle: {    

      type: String,    // Tracking

      default: ''    sentAt: { type: Date, default: null },

    },    clickedAt: { type: Date, default: null },

    status: {    dismissedAt: { type: Date, default: null },

      type: String,    snoozeCount: { type: Number, default: 0 },

      enum: ['Active', 'Snoozed', 'Dismissed', 'Completed'],    

      default: 'Active',    createdAt: { type: Date, default: Date.now },

      index: true    updatedAt: { type: Date, default: Date.now }

    },  },

    isCompleted: {  { _id: false }

      type: Boolean,);

      default: false

    },// Indexes for performance

    completedAt: {reminderSchema.index({ userId: 1, status: 1 });

      type: Date,reminderSchema.index({ userId: 1, reminderDate: 1 });

      default: nullreminderSchema.index({ userId: 1, milestoneId: 1 });

    },reminderSchema.index({ reminderDate: 1, status: 1 });

    snoozedUntil: {reminderSchema.index({ userId: 1, isRecurring: 1 });

      type: Date,

      default: nullconst Reminder = mongoose.model('Reminder', reminderSchema);

    },

    notificationChannels: {export default Reminder;

      email: { type: Boolean, default: true },
      inApp: { type: Boolean, default: true },
      browser: { type: Boolean, default: true }
    },
    sentAt: {
      type: Date,
      default: null
    },
    clickedAt: {
      type: Date,
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Indexes for efficient querying
reminderSchema.index({ userId: 1, reminderDate: 1 });
reminderSchema.index({ userId: 1, status: 1 });
reminderSchema.index({ userId: 1, priority: 1 });
reminderSchema.index({ userId: 1, createdAt: -1 });

const Reminder = mongoose.model('Reminder', reminderSchema);

export default Reminder;
