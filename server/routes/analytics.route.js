const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const auth = require('../middlewares/auth.middleware');

// Apply auth middleware to all analytics routes
router.use(auth);

// @route   GET /api/analytics/summary
// @desc    Get summary statistics for the current user
// @access  Private
router.get('/summary', analyticsController.getSummary);

// @route   GET /api/analytics/heatmap
// @desc    Get heatmap data for the current user
// @access  Private
router.get('/heatmap', analyticsController.getHeatmap);

module.exports = router;
