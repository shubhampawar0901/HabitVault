const Habit = require('../models/habit.model');

/**
 * Get all habits for the current user
 * @route GET /api/habits
 */
const getAllHabits = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all habits for the user with basic info
    const habits = await Habit.findAllByUserId(userId);

    res.json(habits);
  } catch (error) {
    console.error('Error fetching habits:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get a single habit by ID
 * @route GET /api/habits/:id
 */
const getHabitById = async (req, res) => {
  try {
    const habitId = req.params.id;
    const userId = req.user.id;

    // Get the habit
    const habit = await Habit.findByIdAndUserId(habitId, userId);

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    // Get target days if habit has custom target type
    if (habit.target_type === 'custom') {
      habit.target_days = await Habit.getTargetDays(habitId);
    }

    res.json(habit);
  } catch (error) {
    console.error('Error fetching habit:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Create a new habit
 * @route POST /api/habits
 */
const createHabit = async (req, res) => {
  try {
    const { name, target_type, target_days, start_date } = req.body;
    const userId = req.user.id;

    if (!name || !target_type || !start_date) {
      return res.status(400).json({ message: 'Name, target type, and start date are required' });
    }

    // Validate target_type
    if (!['daily', 'weekdays', 'custom'].includes(target_type)) {
      return res.status(400).json({ message: 'Invalid target type' });
    }

    // Validate target_days if target_type is custom
    if (target_type === 'custom' && (!target_days || !Array.isArray(target_days) || target_days.length === 0)) {
      return res.status(400).json({ message: 'Target days are required for custom target type' });
    }

    // Create the habit
    const habitId = await Habit.create({ name, target_type, target_days, start_date }, userId);

    // Get the created habit
    const habit = await Habit.findByIdAndUserId(habitId, userId);

    // Add target days to response if custom
    if (target_type === 'custom') {
      habit.target_days = await Habit.getTargetDays(habitId);
    }

    res.status(201).json(habit);
  } catch (error) {
    console.error('Error creating habit:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update a habit
 * @route PUT /api/habits/:id
 */
const updateHabit = async (req, res) => {
  try {
    const habitId = req.params.id;
    const userId = req.user.id;
    const { name, target_type, target_days } = req.body;

    // Check if habit exists and belongs to user
    const habit = await Habit.findByIdAndUserId(habitId, userId);

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    // Validate target_type if provided
    if (target_type !== undefined && !['daily', 'weekdays', 'custom'].includes(target_type)) {
      return res.status(400).json({ message: 'Invalid target type' });
    }

    // Validate target_days if target_type is or will be custom
    const newTargetType = target_type !== undefined ? target_type : habit.target_type;

    if (target_days !== undefined && newTargetType === 'custom') {
      if (!Array.isArray(target_days) || target_days.length === 0) {
        return res.status(400).json({ message: 'Target days are required for custom target type' });
      }
    }

    // Update the habit
    await Habit.update(habitId, { name, target_type, target_days }, userId);

    // Get the updated habit
    const updatedHabit = await Habit.findByIdAndUserId(habitId, userId);

    // Add target days to response if custom
    if (updatedHabit.target_type === 'custom') {
      updatedHabit.target_days = await Habit.getTargetDays(habitId);
    }

    res.json(updatedHabit);
  } catch (error) {
    console.error('Error updating habit:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete a habit
 * @route DELETE /api/habits/:id
 */
const deleteHabit = async (req, res) => {
  try {
    const habitId = req.params.id;
    const userId = req.user.id;

    // Check if habit exists and belongs to user
    const habit = await Habit.findByIdAndUserId(habitId, userId);

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    // Delete the habit (cascade will delete related records)
    const deleted = await Habit.delete(habitId, userId);

    if (deleted) {
      res.status(204).send();
    } else {
      res.status(500).json({ message: 'Failed to delete habit' });
    }
  } catch (error) {
    console.error('Error deleting habit:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllHabits,
  getHabitById,
  createHabit,
  updateHabit,
  deleteHabit
};
