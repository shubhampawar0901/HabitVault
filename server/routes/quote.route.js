const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quote.controller');

// @route   GET /api/quotes/daily
// @desc    Get the daily motivational quote
// @access  Public
router.get('/daily', quoteController.getDailyQuote);

// @route   GET /api/quotes/random
// @desc    Get a random motivational quote
// @access  Public
router.get('/random', quoteController.getRandomQuote);

// @route   GET /api/quotes/category/:category
// @desc    Get quotes by category
// @access  Public
router.get('/category/:category', quoteController.getQuotesByCategory);

module.exports = router;
