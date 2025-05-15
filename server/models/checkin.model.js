const { pool } = require('../config/database');

class Checkin {
  /**
   * Create a new check-in
   * @param {number} habitId - The habit ID
   * @param {string} date - The check-in date (YYYY-MM-DD)
   * @param {string} status - The check-in status ('completed' or 'missed')
   * @returns {Promise<Object>} - The created check-in
   */
  static async create(habitId, date, status) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Normalize the date to ensure it's in YYYY-MM-DD format
      let normalizedDate = date;
      if (typeof date === 'string' && date.includes('T')) {
        normalizedDate = date.split('T')[0];
      } else if (date instanceof Date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        normalizedDate = `${year}-${month}-${day}`;
      }

      console.log('Creating checkin with normalized date:', {
        original: date,
        normalized: normalizedDate
      });

      // Check if a check-in already exists for this habit and date
      const [existingCheckins] = await connection.execute(
        `SELECT id FROM checkins WHERE habit_id = ? AND date = ?`,
        [habitId, normalizedDate]
      );

      let checkinId;

      if (existingCheckins.length > 0) {
        // Update existing check-in
        checkinId = existingCheckins[0].id;
        await connection.execute(
          `UPDATE checkins SET status = ? WHERE id = ?`,
          [status, checkinId]
        );
      } else {
        // Create new check-in
        const [result] = await connection.execute(
          `INSERT INTO checkins (habit_id, date, status)
           VALUES (?, ?, ?)`,
          [habitId, normalizedDate, status]
        );
        checkinId = result.insertId;
      }

      // Update habit streaks
      await this.updateStreaks(connection, habitId);

      await connection.commit();
      connection.release();

      // Get the updated habit with new streak values
      const [habits] = await pool.execute(
        `SELECT current_streak, longest_streak
         FROM habits
         WHERE id = ?`,
        [habitId]
      );

      return {
        id: checkinId,
        habit_id: habitId,
        date,
        status,
        current_streak: habits[0].current_streak,
        longest_streak: habits[0].longest_streak
      };
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  }

  /**
   * Get check-ins for a habit within a date range
   * @param {number} habitId - The habit ID
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {Promise<Array>} - Array of check-ins
   */
  static async getByDateRange(habitId, startDate, endDate) {
    const [rows] = await pool.execute(
      `SELECT id, habit_id, date, status, created_at, updated_at
       FROM checkins
       WHERE habit_id = ? AND date BETWEEN ? AND ?
       ORDER BY date ASC`,
      [habitId, startDate, endDate]
    );

    // Normalize dates to YYYY-MM-DD format without timezone information
    const normalizedRows = rows.map(row => {
      // Create a new object to avoid modifying the original
      const normalizedRow = { ...row };

      // Convert date to YYYY-MM-DD format
      if (normalizedRow.date) {
        // If date is already a string, ensure it's in YYYY-MM-DD format
        if (typeof normalizedRow.date === 'string') {
          // Extract just the date part if it contains time information
          normalizedRow.date = normalizedRow.date.split('T')[0];
        }
        // If date is a Date object, format it as YYYY-MM-DD
        else if (normalizedRow.date instanceof Date) {
          const year = normalizedRow.date.getFullYear();
          const month = String(normalizedRow.date.getMonth() + 1).padStart(2, '0');
          const day = String(normalizedRow.date.getDate()).padStart(2, '0');
          normalizedRow.date = `${year}-${month}-${day}`;
        }
      }

      return normalizedRow;
    });

    console.log('Normalized checkin dates:', {
      original: rows.map(r => r.date),
      normalized: normalizedRows.map(r => r.date)
    });

    return normalizedRows;
  }

  /**
   * Get recent check-ins for a user
   * @param {number} userId - The user ID
   * @param {number} limit - Maximum number of check-ins to return
   * @returns {Promise<Array>} - Array of check-ins with habit information
   */
  static async getRecentByUserId(userId, limit = 5) {
    // Convert limit to a number and ensure it's a positive integer
    const limitNum = parseInt(limit, 10);

    // Use a direct query with the LIMIT value hardcoded in the SQL
    // This is a workaround for the mysql2 issue with LIMIT parameters
    const [rows] = await pool.execute(
      `SELECT c.id, c.habit_id, h.name as habit_name, c.date, c.status, c.created_at, c.updated_at
       FROM checkins c
       JOIN habits h ON c.habit_id = h.id
       WHERE h.user_id = ? AND c.status = 'completed'
       ORDER BY c.date DESC
       LIMIT ${limitNum}`,
      [userId]
    );

    // Normalize dates to YYYY-MM-DD format without timezone information
    const normalizedRows = rows.map(row => {
      // Create a new object to avoid modifying the original
      const normalizedRow = { ...row };

      // Convert date to YYYY-MM-DD format
      if (normalizedRow.date) {
        // If date is already a string, ensure it's in YYYY-MM-DD format
        if (typeof normalizedRow.date === 'string') {
          // Extract just the date part if it contains time information
          normalizedRow.date = normalizedRow.date.split('T')[0];
        }
        // If date is a Date object, format it as YYYY-MM-DD
        else if (normalizedRow.date instanceof Date) {
          const year = normalizedRow.date.getFullYear();
          const month = String(normalizedRow.date.getMonth() + 1).padStart(2, '0');
          const day = String(normalizedRow.date.getDate()).padStart(2, '0');
          normalizedRow.date = `${year}-${month}-${day}`;
        }
      }

      return normalizedRow;
    });

    console.log('Normalized recent checkin dates:', {
      original: rows.map(r => r.date),
      normalized: normalizedRows.map(r => r.date)
    });

    return normalizedRows;
  }

  /**
   * Batch update check-ins for multiple habits on a specific date
   * @param {string} date - The check-in date (YYYY-MM-DD)
   * @param {Array} updates - Array of {habit_id, status} objects
   * @param {number} userId - User ID for verification
   * @returns {Promise<Object>} - Result with updated habits and streaks
   */
  static async batchUpdate(date, updates, userId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Normalize the date to ensure it's in YYYY-MM-DD format
      let normalizedDate = date;
      if (typeof date === 'string' && date.includes('T')) {
        normalizedDate = date.split('T')[0];
      } else if (date instanceof Date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        normalizedDate = `${year}-${month}-${day}`;
      }

      console.log('Batch updating checkins with normalized date:', {
        original: date,
        normalized: normalizedDate
      });

      const updatedHabits = [];
      const streaks = {};

      for (const update of updates) {
        const { habit_id, status } = update;

        // Verify habit belongs to user
        const [habits] = await connection.execute(
          `SELECT id FROM habits WHERE id = ? AND user_id = ?`,
          [habit_id, userId]
        );

        if (habits.length === 0) {
          continue; // Skip if habit doesn't belong to user
        }

        // Check if a check-in already exists
        const [existingCheckins] = await connection.execute(
          `SELECT id FROM checkins WHERE habit_id = ? AND date = ?`,
          [habit_id, normalizedDate]
        );

        if (existingCheckins.length > 0) {
          // Update existing check-in
          await connection.execute(
            `UPDATE checkins SET status = ? WHERE id = ?`,
            [status, existingCheckins[0].id]
          );
        } else {
          // Create new check-in
          await connection.execute(
            `INSERT INTO checkins (habit_id, date, status)
             VALUES (?, ?, ?)`,
            [habit_id, normalizedDate, status]
          );
        }

        // Update habit streaks
        await this.updateStreaks(connection, habit_id);

        updatedHabits.push(habit_id);

        // Get updated streak values
        const [updatedHabit] = await connection.execute(
          `SELECT current_streak, longest_streak
           FROM habits
           WHERE id = ?`,
          [habit_id]
        );

        streaks[habit_id] = updatedHabit[0].current_streak;
      }

      await connection.commit();
      connection.release();

      return {
        updated_habits: updatedHabits,
        streaks
      };
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  }

  /**
   * Update streak counts for a habit
   * @param {Object} connection - Database connection
   * @param {number} habitId - The habit ID
   * @private
   */
  static async updateStreaks(connection, habitId) {
    // Get habit details
    const [habits] = await connection.execute(
      `SELECT target_type FROM habits WHERE id = ?`,
      [habitId]
    );

    if (habits.length === 0) {
      return;
    }

    const habit = habits[0];

    // Get target days if custom
    let targetDays = [];
    if (habit.target_type === 'custom') {
      const [days] = await connection.execute(
        `SELECT day FROM habit_target_days WHERE habit_id = ?`,
        [habitId]
      );
      targetDays = days.map(d => d.day);
    } else if (habit.target_type === 'weekdays') {
      targetDays = ['mon', 'tue', 'wed', 'thu', 'fri'];
    } else {
      // Daily - all days are target days
      targetDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    }

    // Get all check-ins for this habit, ordered by date
    const [checkins] = await connection.execute(
      `SELECT date, status FROM checkins
       WHERE habit_id = ?
       ORDER BY date DESC`,
      [habitId]
    );

    // Normalize checkin dates
    const normalizedCheckins = checkins.map(checkin => {
      const normalizedCheckin = { ...checkin };

      // Normalize date to YYYY-MM-DD format
      if (normalizedCheckin.date) {
        if (typeof normalizedCheckin.date === 'string' && normalizedCheckin.date.includes('T')) {
          normalizedCheckin.date = normalizedCheckin.date.split('T')[0];
        }
      }

      return normalizedCheckin;
    });

    // Calculate current streak
    let currentStreak = 0;
    for (const checkin of normalizedCheckins) {
      // Get day of week for this date
      const date = new Date(checkin.date);
      const dayOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][date.getDay()];

      // If this is a target day
      if (targetDays.includes(dayOfWeek)) {
        if (checkin.status === 'completed') {
          currentStreak++;
        } else {
          break; // Streak ends at first missed day
        }
      }
    }

    // Calculate longest streak
    const [streakResult] = await connection.execute(
      `SELECT MAX(streak_length) as longest_streak
       FROM (
         SELECT
           COUNT(*) as streak_length
         FROM (
           SELECT
             date,
             status,
             DATE_SUB(date, INTERVAL ROW_NUMBER() OVER (ORDER BY date) DAY) as streak_group
           FROM checkins
           WHERE habit_id = ? AND status = 'completed'
         ) as streak_data
         GROUP BY streak_group
       ) as streak_lengths`,
      [habitId]
    );

    const longestStreak = streakResult[0].longest_streak || 0;

    // Update habit with new streak values
    await connection.execute(
      `UPDATE habits
       SET current_streak = ?, longest_streak = ?
       WHERE id = ?`,
      [currentStreak, Math.max(longestStreak, currentStreak), habitId]
    );
  }
}

module.exports = Checkin;
