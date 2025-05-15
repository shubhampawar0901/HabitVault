const express = require('express');
const router = express.Router();
const templateController = require('../controllers/template.controller');
const auth = require('../middlewares/auth.middleware');

// Apply auth middleware to all template routes
router.use(auth);

// @route   GET /api/templates
// @desc    Get all templates
// @access  Private
router.get('/', templateController.getAllTemplates);

// @route   GET /api/templates/:id
// @desc    Get a single template by ID
// @access  Private
router.get('/:id', templateController.getTemplateById);

// @route   POST /api/templates
// @desc    Create a new template
// @access  Private
router.post('/', templateController.createTemplate);

// @route   PUT /api/templates/:id
// @desc    Update a template
// @access  Private
router.put('/:id', templateController.updateTemplate);

// @route   DELETE /api/templates/:id
// @desc    Delete a template
// @access  Private
router.delete('/:id', templateController.deleteTemplate);

// @route   POST /api/templates/:id/create-habit
// @desc    Create a habit from a template
// @access  Private
router.post('/:id/create-habit', templateController.createHabitFromTemplate);

module.exports = router;
