const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activity.controller');
const auth = require('../middlewares/auth.middleware');

// Apply auth middleware to all activity routes
router.use(auth);

// @route   GET /api/activities/recent
// @desc    Get recent activities for the current user
// @access  Private
router.get('/recent', activityController.getRecentActivities);

// @route   GET /api/activities
// @desc    Get all activities for the current user
// @access  Private
router.get('/', activityController.getAllActivities);

// @route   GET /api/activities/type/:type
// @desc    Get activities by type for the current user
// @access  Private
router.get('/type/:type', activityController.getActivitiesByType);

module.exports = router;
