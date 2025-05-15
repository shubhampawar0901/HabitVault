const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const auth = require('../middlewares/auth.middleware');

// Apply auth middleware to all category routes
router.use(auth);

// @route   GET /api/categories
// @desc    Get all categories
// @access  Private
router.get('/', categoryController.getAllCategories);

// @route   GET /api/categories/:id
// @desc    Get a single category by ID
// @access  Private
router.get('/:id', categoryController.getCategoryById);

// @route   POST /api/categories
// @desc    Create a new category
// @access  Private
router.post('/', categoryController.createCategory);

// @route   PUT /api/categories/:id
// @desc    Update a category
// @access  Private
router.put('/:id', categoryController.updateCategory);

// @route   DELETE /api/categories/:id
// @desc    Delete a category
// @access  Private
router.delete('/:id', categoryController.deleteCategory);

// @route   GET /api/categories/:id/habits
// @desc    Get habits by category
// @access  Private
router.get('/:id/habits', categoryController.getCategoryHabits);

module.exports = router;
