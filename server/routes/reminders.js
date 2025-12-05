import express from 'express';import express from 'express';

import Reminder from '../models/Reminder.js';import Reminder from '../models/Reminder.js';



const router = express.Router();const router = express.Router();



// ===== GET ALL REMINDERS FOR USER =====// ===== GET ALL REMINDERS =====

router.get('/:userId', async (req, res) => {router.get('/:userId', async (req, res) => {

  try {  try {

    const { userId } = req.params;    const { userId } = req.params;

    const { status } = req.query;    const { status, reminderType, milestoneId } = req.query;



    let query = { userId };    let query = { userId };

    if (status) query.status = status;

    if (status) query.status = status;

    const reminders = await Reminder.find(query)    if (reminderType) query.reminderType = reminderType;

      .sort({ reminderDate: 1, reminderTime: 1 })    if (milestoneId) query.milestoneId = milestoneId;

      .lean();

    const reminders = await Reminder.find(query)

    res.json(reminders || []);      .sort({ reminderDate: 1 })

  } catch (error) {      .lean();

    console.error('❌ Error fetching reminders:', error.message);

    res.status(500).json({ error: error.message });    res.json({

  }      success: true,

});      data: reminders

    });

// ===== GET REMINDERS BY DATE =====  } catch (error) {

router.get('/:userId/:date', async (req, res) => {    console.error('❌ Error fetching reminders:', error.message);

  try {    res.status(500).json({

    const { userId, date } = req.params;      success: false,

      message: 'Error fetching reminders',

    const reminders = await Reminder.find({      error: error.message

      userId,    });

      reminderDate: date  }

    })});

      .sort({ reminderTime: 1 })

      .lean();// ===== GET SINGLE REMINDER =====

router.get('/:userId/:reminderId', async (req, res) => {

    res.json(reminders || []);  try {

  } catch (error) {    const { userId, reminderId } = req.params;

    console.error('❌ Error fetching reminders by date:', error.message);

    res.status(500).json({ error: error.message });    const reminder = await Reminder.findOne({ _id: reminderId, userId });

  }

});    if (!reminder) {

      return res.status(404).json({

// ===== GET SINGLE REMINDER =====        success: false,

router.get('/single/:id', async (req, res) => {        message: 'Reminder not found'

  try {      });

    const reminder = await Reminder.findById(req.params.id).lean();    }

    if (!reminder) {

      return res.status(404).json({ error: 'Reminder not found' });    res.json({

    }      success: true,

    res.json(reminder);      data: reminder

  } catch (error) {    });

    console.error('❌ Error fetching reminder:', error.message);  } catch (error) {

    res.status(500).json({ error: error.message });    console.error('❌ Error fetching reminder:', error.message);

  }    res.status(500).json({

});      success: false,

      message: 'Error fetching reminder',

// ===== CREATE NEW REMINDER =====      error: error.message

router.post('/', async (req, res) => {    });

  try {  }

    const {});

      userId,

      title,// ===== CREATE REMINDER =====

      description,router.post('/', async (req, res) => {

      reminderDate,  try {

      reminderTime,    const {

      priority,      userId,

      category,      reminderType,

      reminderType,      relatedId,

      relatedId,      relatedTitle,

      relatedTitle      milestoneId,

    } = req.body;      milestoneDueDate,

      title,

    if (!userId || !title || !reminderDate || !reminderTime) {      description,

      return res.status(400).json({ error: 'userId, title, reminderDate, and reminderTime are required' });      reminderDate,

    }      reminderTime,

      priority,

    const newReminder = new Reminder({      isRecurring,

      userId,      recurrencePattern,

      title,      recurrenceEnd,

      description: description || '',      notificationChannels

      reminderDate,    } = req.body;

      reminderTime,

      priority: priority || 'Medium',    if (!userId || !title || !reminderDate) {

      category: category || 'Personal',      return res.status(400).json({

      reminderType: reminderType || 'Custom',        success: false,

      relatedId: relatedId || '',        message: 'userId, title, and reminderDate are required'

      relatedTitle: relatedTitle || '',      });

      status: 'Active'    }

    });

    const newReminder = new Reminder({

    const saved = await newReminder.save();      userId,

    res.status(201).json(saved);      reminderType: reminderType || 'Custom',

  } catch (error) {      relatedId: relatedId || '',

    console.error('❌ Error creating reminder:', error.message);      relatedTitle: relatedTitle || '',

    res.status(400).json({ error: error.message });      milestoneId: milestoneId || '',

  }      milestoneDueDate: milestoneDueDate || null,

});      title,

      description: description || '',

// ===== UPDATE REMINDER =====      reminderDate: new Date(reminderDate),

router.put('/:id', async (req, res) => {      reminderTime: reminderTime || '09:00',

  try {      priority: priority || 'Medium',

    const { id } = req.params;      isRecurring: isRecurring || false,

    const updates = req.body;      recurrencePattern: recurrencePattern || 'Daily',

      recurrenceEnd: recurrenceEnd ? new Date(recurrenceEnd) : null,

    // Prevent modifying userId      notificationChannels: notificationChannels || {

    delete updates.userId;        email: true,

        inApp: true,

    const updated = await Reminder.findByIdAndUpdate(        sms: false,

      id,        whatsapp: false,

      { ...updates, updatedAt: new Date() },        browser: true

      { new: true }      }

    ).lean();    });



    if (!updated) {    await newReminder.save();

      return res.status(404).json({ error: 'Reminder not found' });

    }    console.log(`✅ Reminder created: ${title}`);



    res.json(updated);    res.status(201).json({

  } catch (error) {      success: true,

    console.error('❌ Error updating reminder:', error.message);      message: 'Reminder created successfully',

    res.status(400).json({ error: error.message });      data: newReminder

  }    });

});  } catch (error) {

    console.error('❌ Error creating reminder:', error.message);

// ===== SNOOZE REMINDER =====    res.status(500).json({

router.put('/:id/snooze', async (req, res) => {      success: false,

  try {      message: 'Error creating reminder',

    const { id } = req.params;      error: error.message

    const { minutes } = req.body;    });

  }

    if (!minutes || minutes < 1) {});

      return res.status(400).json({ error: 'Minutes must be a positive number' });

    }// ===== UPDATE REMINDER =====

router.put('/:userId/:reminderId', async (req, res) => {

    const snoozedUntil = new Date(Date.now() + minutes * 60 * 1000);  try {

    const { userId, reminderId } = req.params;

    const updated = await Reminder.findByIdAndUpdate(    const updates = req.body;

      id,

      {    delete updates.userId;

        status: 'Snoozed',    delete updates.createdAt;

        snoozedUntil,

        updatedAt: new Date()    const reminder = await Reminder.findOneAndUpdate(

      },      { _id: reminderId, userId },

      { new: true }      { ...updates, updatedAt: new Date() },

    ).lean();      { new: true }

    );

    if (!updated) {

      return res.status(404).json({ error: 'Reminder not found' });    if (!reminder) {

    }      return res.status(404).json({

        success: false,

    res.json(updated);        message: 'Reminder not found'

  } catch (error) {      });

    console.error('❌ Error snoozing reminder:', error.message);    }

    res.status(400).json({ error: error.message });

  }    console.log(`✅ Reminder updated: ${reminder.title}`);

});

    res.json({

// ===== COMPLETE REMINDER =====      success: true,

router.put('/:id/complete', async (req, res) => {      message: 'Reminder updated successfully',

  try {      data: reminder

    const { id } = req.params;    });

  } catch (error) {

    const updated = await Reminder.findByIdAndUpdate(    console.error('❌ Error updating reminder:', error.message);

      id,    res.status(500).json({

      {      success: false,

        status: 'Completed',      message: 'Error updating reminder',

        isCompleted: true,      error: error.message

        completedAt: new Date(),    });

        updatedAt: new Date()  }

      },});

      { new: true }

    ).lean();// ===== SNOOZE REMINDER =====

router.post('/:userId/:reminderId/snooze', async (req, res) => {

    if (!updated) {  try {

      return res.status(404).json({ error: 'Reminder not found' });    const { userId, reminderId } = req.params;

    }    const { snoozeMinutes = 15 } = req.body;



    res.json(updated);    const snoozedUntil = new Date(Date.now() + snoozeMinutes * 60 * 1000);

  } catch (error) {

    console.error('❌ Error completing reminder:', error.message);    const reminder = await Reminder.findOneAndUpdate(

    res.status(400).json({ error: error.message });      { _id: reminderId, userId },

  }      {

});        status: 'Snoozed',

        snoozedUntil,

// ===== DISMISS REMINDER =====        snoozeCount: Reminder.snoozeCount + 1,

router.put('/:id/dismiss', async (req, res) => {        updatedAt: new Date()

  try {      },

    const { id } = req.params;      { new: true }

    );

    const updated = await Reminder.findByIdAndUpdate(

      id,    if (!reminder) {

      {      return res.status(404).json({

        status: 'Dismissed',        success: false,

        updatedAt: new Date()        message: 'Reminder not found'

      },      });

      { new: true }    }

    ).lean();

    console.log(`✅ Reminder snoozed for ${snoozeMinutes} minutes: ${reminder.title}`);

    if (!updated) {

      return res.status(404).json({ error: 'Reminder not found' });    res.json({

    }      success: true,

      message: 'Reminder snoozed successfully',

    res.json(updated);      data: reminder

  } catch (error) {    });

    console.error('❌ Error dismissing reminder:', error.message);  } catch (error) {

    res.status(400).json({ error: error.message });    console.error('❌ Error snoozing reminder:', error.message);

  }    res.status(500).json({

});      success: false,

      message: 'Error snoozing reminder',

// ===== DELETE REMINDER =====      error: error.message

router.delete('/:id', async (req, res) => {    });

  try {  }

    const { id } = req.params;});

    const deleted = await Reminder.findByIdAndDelete(id);

// ===== DISMISS REMINDER =====

    if (!deleted) {router.post('/:userId/:reminderId/dismiss', async (req, res) => {

      return res.status(404).json({ error: 'Reminder not found' });  try {

    }    const { userId, reminderId } = req.params;



    res.json({ message: 'Reminder deleted successfully', data: deleted });    const reminder = await Reminder.findOneAndUpdate(

  } catch (error) {      { _id: reminderId, userId },

    console.error('❌ Error deleting reminder:', error.message);      {

    res.status(500).json({ error: error.message });        status: 'Dismissed',

  }        dismissedAt: new Date(),

});        updatedAt: new Date()

      },

// ===== GET ACTIVE & UPCOMING REMINDERS =====      { new: true }

router.get('/:userId/upcoming/list', async (req, res) => {    );

  try {

    const { userId } = req.params;    if (!reminder) {

    const today = new Date().toISOString().split('T')[0];      return res.status(404).json({

        success: false,

    const reminders = await Reminder.find({        message: 'Reminder not found'

      userId,      });

      reminderDate: { $gte: today },    }

      status: { $in: ['Active', 'Snoozed'] }

    })    console.log(`✅ Reminder dismissed: ${reminder.title}`);

      .sort({ reminderDate: 1, reminderTime: 1 })

      .lean();    res.json({

      success: true,

    res.json(reminders || []);      message: 'Reminder dismissed successfully',

  } catch (error) {      data: reminder

    console.error('❌ Error fetching upcoming reminders:', error.message);    });

    res.status(500).json({ error: error.message });  } catch (error) {

  }    console.error('❌ Error dismissing reminder:', error.message);

});    res.status(500).json({

      success: false,

export default router;      message: 'Error dismissing reminder',

      error: error.message
    });
  }
});

// ===== MARK REMINDER AS COMPLETED =====
router.post('/:userId/:reminderId/complete', async (req, res) => {
  try {
    const { userId, reminderId } = req.params;

    const reminder = await Reminder.findOneAndUpdate(
      { _id: reminderId, userId },
      {
        status: 'Completed',
        isCompleted: true,
        completedAt: new Date(),
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    console.log(`✅ Reminder completed: ${reminder.title}`);

    res.json({
      success: true,
      message: 'Reminder marked as completed',
      data: reminder
    });
  } catch (error) {
    console.error('❌ Error completing reminder:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error completing reminder',
      error: error.message
    });
  }
});

// ===== DELETE REMINDER =====
router.delete('/:userId/:reminderId', async (req, res) => {
  try {
    const { userId, reminderId } = req.params;

    const reminder = await Reminder.findOneAndDelete({ _id: reminderId, userId });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    console.log(`✅ Reminder deleted: ${reminder.title}`);

    res.json({
      success: true,
      message: 'Reminder deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting reminder:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error deleting reminder',
      error: error.message
    });
  }
});

// ===== GET UPCOMING REMINDERS =====
router.get('/:userId/upcoming', async (req, res) => {
  try {
    const { userId } = req.params;
    const { days = 7 } = req.query;

    const today = new Date();
    const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);

    const upcomingReminders = await Reminder.find({
      userId,
      status: { $in: ['Active', 'Snoozed'] },
      reminderDate: { $gte: today, $lte: futureDate }
    })
      .sort({ reminderDate: 1 })
      .lean();

    res.json({
      success: true,
      data: upcomingReminders
    });
  } catch (error) {
    console.error('❌ Error fetching upcoming reminders:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching upcoming reminders',
      error: error.message
    });
  }
});

export default router;
