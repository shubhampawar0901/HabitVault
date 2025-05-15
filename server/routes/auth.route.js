const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const auth = require('../middlewares/auth.middleware');
const { validate, validateRegisterInput, validateLoginInput } = require('../middlewares/validation.middleware');
const cookieParser = require('cookie-parser');

// Apply cookie parser middleware
router.use(cookieParser());

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validate(validateRegisterInput), authController.register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validate(validateLoginInput), authController.login);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Public
router.post('/logout', authController.logout);

// Refresh token route removed as per requirements

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, authController.getMe);

// @route   POST /api/auth/forgot-password
// @desc    Request password reset
// @access  Public
router.post('/forgot-password', authController.forgotPassword);

// @route   POST /api/auth/reset-password/verify
// @desc    Verify reset token
// @access  Public
router.post('/reset-password/verify', authController.verifyResetToken);

// @route   POST /api/auth/reset-password
// @desc    Reset password
// @access  Public
router.post('/reset-password', authController.resetPassword);

module.exports = router;