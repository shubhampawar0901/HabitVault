const { pool } = require('../config/database');

class Habit {
  /**
   * Find all habits for a user
   * @param {number} userId - The user ID
   * @returns {Promise<Array>} - Array of habits
   */
  static async findAllByUserId(userId) {
    const [rows] = await pool.execute(
      `SELECT id, name, target_type, start_date, current_streak, longest_streak, created_at, updated_at
       FROM habits
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );
    return rows;
  }

  /**
   * Find a habit by ID for a specific user
   * @param {number} id - The habit ID
   * @param {number} userId - The user ID
   * @returns {Promise<Object>} - Habit object
   */
  static async findByIdAndUserId(id, userId) {
    const [rows] = await pool.execute(
      `SELECT id, name, target_type, start_date, current_streak, longest_streak, created_at, updated_at
       FROM habits
       WHERE id = ? AND user_id = ?`,
      [id, userId]
    );
    return rows[0];
  }

  /**
   * Get target days for a habit
   * @param {number} habitId - The habit ID
   * @returns {Promise<Array>} - Array of target days
   */
  static async getTargetDays(habitId) {
    const [rows] = await pool.execute(
      `SELECT day
       FROM habit_target_days
       WHERE habit_id = ?`,
      [habitId]
    );
    return rows.map(row => row.day);
  }

  /**
   * Create a new habit
   * @param {Object} habitData - The habit data
   * @param {number} userId - The user ID
   * @returns {Promise<number>} - The new habit ID
   */
  static async create(habitData, userId) {
    const { name, target_type, start_date } = habitData;
    
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Insert the habit
      const [result] = await connection.execute(
        `INSERT INTO habits (user_id, name, target_type, start_date)
         VALUES (?, ?, ?, ?)`,
        [userId, name, target_type, start_date]
      );
      
      const habitId = result.insertId;
      
      // Insert target days if target_type is custom
      if (target_type === 'custom' && habitData.target_days && Array.isArray(habitData.target_days)) {
        const validDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        const filteredDays = habitData.target_days.filter(day => validDays.includes(day));
        
        for (const day of filteredDays) {
          await connection.execute(
            `INSERT INTO habit_target_days (habit_id, day)
             VALUES (?, ?)`,
            [habitId, day]
          );
        }
      }
      
      await connection.commit();
      connection.release();
      
      return habitId;
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  }

  /**
   * Update a habit
   * @param {number} id - The habit ID
   * @param {Object} habitData - The habit data to update
   * @param {number} userId - The user ID
   * @returns {Promise<boolean>} - Success status
   */
  static async update(id, habitData, userId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Build update query based on provided fields
      let updateQuery = 'UPDATE habits SET ';
      const updateValues = [];
      
      if (habitData.name !== undefined) {
        updateQuery += 'name = ?, ';
        updateValues.push(habitData.name);
      }
      
      if (habitData.target_type !== undefined) {
        updateQuery += 'target_type = ?, ';
        updateValues.push(habitData.target_type);
      }
      
      // Remove trailing comma and space if there are fields to update
      if (updateValues.length > 0) {
        updateQuery = updateQuery.slice(0, -2);
        updateQuery += ' WHERE id = ? AND user_id = ?';
        updateValues.push(id, userId);
        
        await connection.execute(updateQuery, updateValues);
      }
      
      // Update target days if provided and target_type is or will be custom
      if (habitData.target_days !== undefined) {
        // Get current target_type if not provided in update
        let targetType = habitData.target_type;
        if (targetType === undefined) {
          const [habits] = await connection.execute(
            'SELECT target_type FROM habits WHERE id = ? AND user_id = ?',
            [id, userId]
          );
          
          if (habits.length === 0) {
            throw new Error('Habit not found');
          }
          
          targetType = habits[0].target_type;
        }
        
        if (targetType === 'custom') {
          // Delete existing target days
          await connection.execute(
            'DELETE FROM habit_target_days WHERE habit_id = ?',
            [id]
          );
          
          // Insert new target days
          const validDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
          const filteredDays = habitData.target_days.filter(day => validDays.includes(day));
          
          for (const day of filteredDays) {
            await connection.execute(
              'INSERT INTO habit_target_days (habit_id, day) VALUES (?, ?)',
              [id, day]
            );
          }
        }
      }
      
      await connection.commit();
      connection.release();
      
      return true;
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  }

  /**
   * Delete a habit
   * @param {number} id - The habit ID
   * @param {number} userId - The user ID
   * @returns {Promise<boolean>} - Success status
   */
  static async delete(id, userId) {
    const [result] = await pool.execute(
      'DELETE FROM habits WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    
    return result.affectedRows > 0;
  }
}

module.exports = Habit;
