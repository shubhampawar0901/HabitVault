const Quote = require('../models/quote.model');

/**
 * Get the daily motivational quote
 * @route GET /api/quotes/daily
 */
const getDailyQuote = async (req, res) => {
  try {
    const quote = await Quote.getDailyQuote();
    res.json(quote);
  } catch (error) {
    console.error('Error getting daily quote:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get a random motivational quote
 * @route GET /api/quotes/random
 */
const getRandomQuote = async (req, res) => {
  try {
    const quote = await Quote.getRandomQuote();
    res.json(quote);
  } catch (error) {
    console.error('Error getting random quote:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get quotes by category
 * @route GET /api/quotes/category/:category
 */
const getQuotesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const quotes = await Quote.getQuotesByCategory(category);
    res.json(quotes);
  } catch (error) {
    console.error('Error getting quotes by category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getDailyQuote,
  getRandomQuote,
  getQuotesByCategory
};
