const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middlewares/auth.middleware');

// @route   GET /api/users/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, userController.getProfile);

// @route   PUT /api/users/me
// @desc    Update user profile
// @access  Private
router.put('/me', auth, userController.updateProfile);

module.exports = router;