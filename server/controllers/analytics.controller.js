const Analytics = require('../models/analytics.model');

/**
 * Get summary statistics for the current user
 * @route GET /api/analytics/summary
 */
const getSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { start_date, end_date } = req.query;

    // Default to last 30 days if no dates provided
    const startDate = start_date || new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0];
    const endDate = end_date || new Date().toISOString().split('T')[0];

    const summary = await Analytics.getSummary(userId, startDate, endDate);

    res.json(summary);
  } catch (error) {
    console.error('Error getting summary:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get heatmap data for the current user
 * @route GET /api/analytics/heatmap
 */
const getHeatmap = async (req, res) => {
  try {
    const userId = req.user.id;
    const { start_date, end_date } = req.query;

    console.log('Heatmap API request received:', {
      userId,
      query_params: req.query,
      start_date,
      end_date
    });

    // Default to current month if no dates provided
    const startDate = start_date || new Date(new Date().setDate(1)).toISOString().split('T')[0];
    const endDate = end_date || new Date(new Date().setMonth(new Date().getMonth() + 1, 0)).toISOString().split('T')[0];

    console.log('Heatmap date range:', { startDate, endDate });

    const heatmap = await Analytics.getHeatmap(userId, startDate, endDate);

    // Log a sample of the response for debugging
    const habitIds = Object.keys(heatmap);
    console.log('Heatmap response summary:', {
      totalHabits: habitIds.length,
      sampleHabitIds: habitIds.slice(0, 3),
      firstHabitCheckins: habitIds.length > 0 ? heatmap[habitIds[0]].checkins : {}
    });

    res.json(heatmap);
  } catch (error) {
    console.error('Error getting heatmap:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getSummary,
  getHeatmap
};
