const { pool } = require('../config/database');

class Analytics {
  /**
   * Get summary statistics for a user
   * @param {number} userId - The user ID
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {Promise<Object>} - Summary statistics
   */
  static async getSummary(userId, startDate, endDate) {
    const connection = await pool.getConnection();

    try {
      // Get total habits count
      const [habitsCount] = await connection.execute(
        `SELECT COUNT(*) as total
         FROM habits
         WHERE user_id = ?`,
        [userId]
      );

      // Get habits with current streaks
      const [streaks] = await connection.execute(
        `SELECT id, name, current_streak, longest_streak
         FROM habits
         WHERE user_id = ?
         ORDER BY current_streak DESC`,
        [userId]
      );

      // Get completion rate for the specified date range
      const [completionRate] = await connection.execute(
        `SELECT
           ROUND(
             SUM(CASE WHEN c.status = 'completed' THEN 1 ELSE 0 END) /
             COUNT(*) * 100,
             2
           ) as rate
         FROM checkins c
         JOIN habits h ON c.habit_id = h.id
         WHERE h.user_id = ?
         AND c.date BETWEEN ? AND ?`,
        [userId, startDate, endDate]
      );

      // Get habit types distribution
      const [habitTypes] = await connection.execute(
        `SELECT
           target_type,
           COUNT(*) as count
         FROM habits
         WHERE user_id = ?
         GROUP BY target_type`,
        [userId]
      );

      connection.release();

      return {
        total_habits: habitsCount[0].total,
        completion_rate: completionRate[0]?.rate || 0,
        habit_types: habitTypes.reduce((acc, type) => {
          acc[type.target_type] = type.count;
          return acc;
        }, {}),
        top_streaks: streaks.slice(0, 5),
        longest_streak: streaks.reduce((max, habit) =>
          Math.max(max, habit.longest_streak), 0)
      };
    } catch (error) {
      connection.release();
      throw error;
    }
  }

  /**
   * Get heatmap data for a user
   * @param {number} userId - The user ID
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {Promise<Object>} - Heatmap data
   */
  static async getHeatmap(userId, startDate, endDate) {
    console.log('Analytics.getHeatmap called with:', { userId, startDate, endDate });

    const connection = await pool.getConnection();

    try {
      // Get all habits for the user
      const [habits] = await connection.execute(
        `SELECT id, name, target_type
         FROM habits
         WHERE user_id = ?`,
        [userId]
      );

      const result = {};

      // For each habit, get check-ins within date range
      for (const habit of habits) {
        const [checkins] = await connection.execute(
          `SELECT date, status
           FROM checkins
           WHERE habit_id = ? AND date BETWEEN ? AND ?
           ORDER BY date ASC`,
          [habit.id, startDate, endDate]
        );

        // Convert to map of date -> status for easier lookup
        const checkinMap = {};
        for (const checkin of checkins) {
          // Format the date as YYYY-MM-DD string
          let dateStr;

          if (checkin.date instanceof Date) {
            // If it's a Date object, format it manually to avoid timezone issues
            const year = checkin.date.getFullYear();
            const month = String(checkin.date.getMonth() + 1).padStart(2, '0');
            const day = String(checkin.date.getDate()).padStart(2, '0');
            dateStr = `${year}-${month}-${day}`;
          } else if (typeof checkin.date === 'string') {
            // If it's already a string, extract just the date part
            if (checkin.date.includes('T')) {
              dateStr = checkin.date.split('T')[0];
            } else if (checkin.date.includes(' ')) {
              // Handle other string formats
              const date = new Date(checkin.date);
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              dateStr = `${year}-${month}-${day}`;
            } else {
              // Assume it's already in YYYY-MM-DD format
              dateStr = checkin.date;
            }
          } else {
            // Fallback
            dateStr = new Date(checkin.date).toISOString().split('T')[0];
          }

          // Log for debugging
          console.log('Heatmap checkin date:', {
            originalDate: checkin.date,
            formattedDate: dateStr,
            habitId: habit.id,
            habitName: habit.name,
            status: checkin.status
          });

          checkinMap[dateStr] = checkin.status;
        }

        result[habit.id] = {
          name: habit.name,
          target_type: habit.target_type,
          checkins: checkinMap
        };
      }

      connection.release();

      return result;
    } catch (error) {
      connection.release();
      throw error;
    }
  }
}

module.exports = Analytics;
