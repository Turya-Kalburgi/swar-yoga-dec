import express from 'express';
import DailyPlan from '../models/DailyPlan.js';

const router = express.Router();

// ===== GET ALL DAILY PLANS FOR USER =====
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const plans = await DailyPlan.find({ userId })
      .sort({ date: -1, time: 1 })
      .lean();
    res.json(plans || []);
  } catch (error) {
    console.error('❌ Error fetching daily plans:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ===== GET DAILY PLANS FOR SPECIFIC DATE =====
router.get('/:userId/:date', async (req, res) => {
  try {
    const { userId, date } = req.params;
    const plans = await DailyPlan.find({ userId, date })
      .sort({ time: 1 })
      .lean();
    res.json(plans || []);
  } catch (error) {
    console.error('❌ Error fetching plans for date:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ===== GET SINGLE DAILY PLAN =====
router.get('/single/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await DailyPlan.findById(id).lean();
    
    if (!plan) {
      return res.status(404).json({ 
        success: false, 
        error: 'Daily plan not found' 
      });
    }
    
    res.json(plan);
  } catch (error) {
    console.error('❌ Error fetching daily plan:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ===== CREATE NEW DAILY PLAN =====
router.post('/', async (req, res) => {
  try {
    const { userId, date, time, activity, description, category, priority, duration, reminder, reminderTime } = req.body;

    // Validation
    if (!userId || !date || !time || !activity) {
      return res.status(400).json({
        success: false,
        error: 'userId, date, time, and activity are required'
      });
    }

    const newPlan = new DailyPlan({
      userId,
      date,
      time,
      activity,
      description,
      category: category || 'personal',
      priority: priority || 'Medium',
      duration: duration || 30,
      reminder: reminder || false,
      reminderTime: reminderTime || '',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const saved = await newPlan.save();
    console.log('✅ Daily plan created:', saved._id);

    res.status(201).json({
      success: true,
      data: saved
    });
  } catch (error) {
    console.error('❌ Error creating daily plan:', error.message);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// ===== UPDATE DAILY PLAN =====
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // If marking as completed, set completedAt timestamp
    if (updates.completed && !updates.completedAt) {
      updates.completedAt = new Date();
    }

    updates.updatedAt = new Date();

    const updated = await DailyPlan.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Daily plan not found'
      });
    }

    console.log('✅ Daily plan updated:', id);
    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    console.error('❌ Error updating daily plan:', error.message);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// ===== DELETE DAILY PLAN =====
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await DailyPlan.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Daily plan not found'
      });
    }

    console.log('✅ Daily plan deleted:', id);
    res.json({
      success: true,
      message: 'Daily plan deleted successfully',
      data: deleted
    });
  } catch (error) {
    console.error('❌ Error deleting daily plan:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ===== BULK DELETE COMPLETED DAILY PLANS =====
router.delete('/:userId/completed/all', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await DailyPlan.deleteMany({ userId, completed: true });

    console.log(`✅ Deleted ${result.deletedCount} completed daily plans for user ${userId}`);
    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} completed plans`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('❌ Error bulk deleting plans:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
