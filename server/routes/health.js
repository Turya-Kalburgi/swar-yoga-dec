import express from 'express';
import HealthTracker from '../models/HealthTracker.js';

const router = express.Router();

// ===== GET ALL HEALTH DATA FOR USER =====
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const health = await HealthTracker.find({ userId })
      .sort({ date: -1 })
      .lean();
    res.json(health || []);
  } catch (error) {
    console.error('❌ Error fetching health data:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ===== GET HEALTH DATA FOR SPECIFIC DATE =====
router.get('/:userId/:date', async (req, res) => {
  try {
    const { userId, date } = req.params;
    const health = await HealthTracker.findOne({ userId, date }).lean();
    res.json(health || {});
  } catch (error) {
    console.error('❌ Error fetching health data for date:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ===== GET SINGLE HEALTH RECORD =====
router.get('/single/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const health = await HealthTracker.findById(id).lean();
    
    if (!health) {
      return res.status(404).json({
        success: false,
        error: 'Health record not found'
      });
    }
    
    res.json(health);
  } catch (error) {
    console.error('❌ Error fetching health record:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ===== CREATE OR UPDATE HEALTH DATA =====
router.post('/', async (req, res) => {
  try {
    const { userId, date } = req.body;

    // Validation
    if (!userId || !date) {
      return res.status(400).json({
        success: false,
        error: 'userId and date are required'
      });
    }

    // Check if health data exists for this date
    let health = await HealthTracker.findOne({ userId, date });

    if (health) {
      // Update existing record
      Object.assign(health, req.body);
      health.updatedAt = new Date();
      await health.save();
      console.log('✅ Health data updated:', health._id);
    } else {
      // Create new record
      health = new HealthTracker({
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await health.save();
      console.log('✅ Health data created:', health._id);
    }

    res.status(201).json({
      success: true,
      data: health
    });
  } catch (error) {
    console.error('❌ Error creating/updating health data:', error.message);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// ===== UPDATE HEALTH DATA =====
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.updatedAt = new Date();

    const updated = await HealthTracker.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Health record not found'
      });
    }

    console.log('✅ Health data updated:', id);
    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    console.error('❌ Error updating health data:', error.message);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// ===== DELETE HEALTH DATA =====
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await HealthTracker.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Health record not found'
      });
    }

    console.log('✅ Health data deleted:', id);
    res.json({
      success: true,
      message: 'Health record deleted successfully',
      data: deleted
    });
  } catch (error) {
    console.error('❌ Error deleting health data:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
