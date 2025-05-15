const Checkin = require('../models/checkin.model');
const Habit = require('../models/habit.model');

/**
 * Create or update a check-in for a habit
 * @route POST /api/habits/:id/checkins
 */
const createCheckin = async (req, res) => {
  try {
    const habitId = req.params.id;
    const userId = req.user.id;
    let { date, status } = req.body;

    if (!date || !status) {
      return res.status(400).json({ message: 'Date and status are required' });
    }

    if (!['completed', 'missed'].includes(status)) {
      return res.status(400).json({ message: 'Status must be either "completed" or "missed"' });
    }

    // Normalize date to ensure YYYY-MM-DD format
    if (date && date.includes('T')) {
      date = date.split('T')[0];
    }

    console.log('Creating checkin with normalized date:', {
      originalDate: req.body.date,
      normalizedDate: date,
      status
    });

    // Verify habit belongs to user
    const habit = await Habit.findByIdAndUserId(habitId, userId);
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    // Create or update check-in
    const checkin = await Checkin.create(habitId, date, status);

    res.json({
      current_streak: checkin.current_streak,
      longest_streak: checkin.longest_streak
    });
  } catch (error) {
    console.error('Error creating check-in:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get check-ins for a habit
 * @route GET /api/habits/:id/checkins
 */
const getCheckins = async (req, res) => {
  try {
    const habitId = req.params.id;
    const userId = req.user.id;
    const { start_date, end_date } = req.query;

    // Default to current month if no dates provided
    let startDate = start_date || new Date(new Date().setDate(1)).toISOString().split('T')[0];
    let endDate = end_date || new Date(new Date().setMonth(new Date().getMonth() + 1, 0)).toISOString().split('T')[0];

    // Normalize dates to ensure YYYY-MM-DD format
    if (startDate && startDate.includes('T')) {
      startDate = startDate.split('T')[0];
    }

    if (endDate && endDate.includes('T')) {
      endDate = endDate.split('T')[0];
    }

    console.log('Getting checkins with normalized date range:', {
      originalStart: start_date,
      originalEnd: end_date,
      normalizedStart: startDate,
      normalizedEnd: endDate
    });

    // Verify habit belongs to user
    const habit = await Habit.findByIdAndUserId(habitId, userId);
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    // Get check-ins
    const checkins = await Checkin.getByDateRange(habitId, startDate, endDate);

    res.json(checkins);
  } catch (error) {
    console.error('Error getting check-ins:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Batch update check-ins for multiple habits
 * @route POST /api/checkins/batch
 */
const batchUpdateCheckins = async (req, res) => {
  try {
    const userId = req.user.id;
    let { date, updates } = req.body;

    if (!date || !updates || !Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ message: 'Date and updates array are required' });
    }

    // Normalize date to ensure YYYY-MM-DD format
    if (date && date.includes('T')) {
      date = date.split('T')[0];
    }

    console.log('Batch updating checkins with normalized date:', {
      originalDate: req.body.date,
      normalizedDate: date,
      updateCount: updates.length
    });

    // Validate updates
    for (const update of updates) {
      if (!update.habit_id || !update.status) {
        return res.status(400).json({ message: 'Each update must include habit_id and status' });
      }

      if (!['completed', 'missed'].includes(update.status)) {
        return res.status(400).json({ message: 'Status must be either "completed" or "missed"' });
      }
    }

    // Batch update check-ins
    const result = await Checkin.batchUpdate(date, updates, userId);

    res.json(result);
  } catch (error) {
    console.error('Error batch updating check-ins:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createCheckin,
  getCheckins,
  batchUpdateCheckins
};
