const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habit.controller');
const checkinController = require('../controllers/checkin.controller');
const categoryController = require('../controllers/category.controller');
const auth = require('../middlewares/auth.middleware');

// Apply auth middleware to all habit routes
router.use(auth);

// @route   GET /api/habits
// @desc    Get all habits for the current user
// @access  Private
router.get('/', habitController.getAllHabits);

// @route   GET /api/habits/:id
// @desc    Get a single habit by ID
// @access  Private
router.get('/:id', habitController.getHabitById);

// @route   POST /api/habits
// @desc    Create a new habit
// @access  Private
router.post('/', habitController.createHabit);

// @route   PUT /api/habits/:id
// @desc    Update a habit
// @access  Private
router.put('/:id', habitController.updateHabit);

// @route   DELETE /api/habits/:id
// @desc    Delete a habit
// @access  Private
router.delete('/:id', habitController.deleteHabit);

// @route   POST /api/habits/:id/checkins
// @desc    Create or update a check-in for a habit
// @access  Private
router.post('/:id/checkins', checkinController.createCheckin);

// @route   GET /api/habits/:id/checkins
// @desc    Get check-ins for a habit
// @access  Private
router.get('/:id/checkins', checkinController.getCheckins);

// @route   GET /api/habits/:id/categories
// @desc    Get categories for a habit
// @access  Private
router.get('/:id/categories', categoryController.getHabitCategories);

// @route   POST /api/habits/:id/categories
// @desc    Add categories to a habit
// @access  Private
router.post('/:id/categories', categoryController.addHabitCategories);

// @route   DELETE /api/habits/:habitId/categories/:categoryId
// @desc    Remove a category from a habit
// @access  Private
router.delete('/:habitId/categories/:categoryId', categoryController.removeHabitCategory);

module.exports = router;
