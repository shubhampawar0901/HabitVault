const { pool } = require('../config/database');

class Quote {
  /**
   * Get a quote for the day
   * @returns {Promise<Object>} - Quote object with text and author
   */
  static async getDailyQuote() {
    try {
      // Use the current date to select a quote
      const today = new Date();
      const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));

      // Get total number of quotes
      const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM quotes');
      const totalQuotes = countResult[0].total;

      if (totalQuotes === 0) {
        return { text: "No quotes available", author: "System" };
      }

      // Use the day of year to select a quote (ensures same quote all day, changes daily)
      const quoteIndex = (dayOfYear % totalQuotes) + 1; // +1 because IDs start at 1

      // Get the quote for today
      const [quotes] = await pool.execute(
        'SELECT id, text, author, category FROM quotes WHERE id = ?',
        [quoteIndex]
      );

      if (quotes.length === 0) {
        // Fallback to a random quote if the specific ID doesn't exist
        const [randomQuotes] = await pool.execute(
          'SELECT id, text, author, category FROM quotes ORDER BY RAND() LIMIT 1'
        );

        return randomQuotes[0];
      }

      return quotes[0];
    } catch (error) {
      console.error('Error getting daily quote:', error);
      return { text: "Error fetching quote", author: "System" };
    }
  }

  /**
   * Get a random quote
   * @returns {Promise<Object>} - Quote object with text and author
   */
  static async getRandomQuote() {
    try {
      const [quotes] = await pool.execute(
        'SELECT id, text, author, category FROM quotes ORDER BY RAND() LIMIT 1'
      );

      if (quotes.length === 0) {
        return { text: "No quotes available", author: "System" };
      }

      return quotes[0];
    } catch (error) {
      console.error('Error getting random quote:', error);
      return { text: "Error fetching quote", author: "System" };
    }
  }

  /**
   * Get quotes by category
   * @param {string} category - The quote category
   * @returns {Promise<Array>} - Array of quote objects
   */
  static async getQuotesByCategory(category) {
    try {
      const [quotes] = await pool.execute(
        'SELECT id, text, author, category FROM quotes WHERE category = ?',
        [category]
      );

      return quotes;
    } catch (error) {
      console.error('Error getting quotes by category:', error);
      return [];
    }
  }
}

module.exports = Quote;
