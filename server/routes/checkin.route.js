const express = require('express');
const router = express.Router();
const checkinController = require('../controllers/checkin.controller');
const auth = require('../middlewares/auth.middleware');

// Apply auth middleware to all checkin routes
router.use(auth);

// @route   POST /api/checkins/batch
// @desc    Batch update check-ins for multiple habits
// @access  Private
router.post('/batch', checkinController.batchUpdateCheckins);

module.exports = router;
