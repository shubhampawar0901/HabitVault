const { pool } = require('../config/database');

class Category {
  /**
   * Get all categories
   * @returns {Promise<Array>} - Array of categories
   */
  static async getAll() {
    const [rows] = await pool.execute(
      `SELECT id, name, color, created_at, updated_at
       FROM categories
       ORDER BY name ASC`
    );
    
    return rows;
  }
  
  /**
   * Get a category by ID
   * @param {number} id - The category ID
   * @returns {Promise<Object>} - Category object
   */
  static async getById(id) {
    const [rows] = await pool.execute(
      `SELECT id, name, color, created_at, updated_at
       FROM categories
       WHERE id = ?`,
      [id]
    );
    
    return rows[0];
  }
  
  /**
   * Create a new category
   * @param {Object} categoryData - The category data
   * @returns {Promise<number>} - The new category ID
   */
  static async create(categoryData) {
    const { name, color } = categoryData;
    
    const [result] = await pool.execute(
      `INSERT INTO categories (name, color)
       VALUES (?, ?)`,
      [name, color || '#3498db']
    );
    
    return result.insertId;
  }
  
  /**
   * Update a category
   * @param {number} id - The category ID
   * @param {Object} categoryData - The category data to update
   * @returns {Promise<boolean>} - Success status
   */
  static async update(id, categoryData) {
    const { name, color } = categoryData;
    
    // Build update query based on provided fields
    let updateQuery = 'UPDATE categories SET ';
    const updateValues = [];
    
    if (name !== undefined) {
      updateQuery += 'name = ?, ';
      updateValues.push(name);
    }
    
    if (color !== undefined) {
      updateQuery += 'color = ?, ';
      updateValues.push(color);
    }
    
    // Remove trailing comma and space if there are fields to update
    if (updateValues.length > 0) {
      updateQuery = updateQuery.slice(0, -2);
      updateQuery += ' WHERE id = ?';
      updateValues.push(id);
      
      const [result] = await pool.execute(updateQuery, updateValues);
      return result.affectedRows > 0;
    }
    
    return false;
  }
  
  /**
   * Delete a category
   * @param {number} id - The category ID
   * @returns {Promise<boolean>} - Success status
   */
  static async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM categories WHERE id = ?',
      [id]
    );
    
    return result.affectedRows > 0;
  }
  
  /**
   * Get categories for a habit
   * @param {number} habitId - The habit ID
   * @returns {Promise<Array>} - Array of categories
   */
  static async getForHabit(habitId) {
    const [rows] = await pool.execute(
      `SELECT c.id, c.name, c.color
       FROM categories c
       JOIN habit_categories hc ON c.id = hc.category_id
       WHERE hc.habit_id = ?
       ORDER BY c.name ASC`,
      [habitId]
    );
    
    return rows;
  }
  
  /**
   * Add categories to a habit
   * @param {number} habitId - The habit ID
   * @param {Array} categoryIds - Array of category IDs
   * @returns {Promise<boolean>} - Success status
   */
  static async addToHabit(habitId, categoryIds) {
    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
      return false;
    }
    
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Delete existing categories for this habit
      await connection.execute(
        'DELETE FROM habit_categories WHERE habit_id = ?',
        [habitId]
      );
      
      // Add new categories
      for (const categoryId of categoryIds) {
        await connection.execute(
          'INSERT INTO habit_categories (habit_id, category_id) VALUES (?, ?)',
          [habitId, categoryId]
        );
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
   * Remove a category from a habit
   * @param {number} habitId - The habit ID
   * @param {number} categoryId - The category ID
   * @returns {Promise<boolean>} - Success status
   */
  static async removeFromHabit(habitId, categoryId) {
    const [result] = await pool.execute(
      'DELETE FROM habit_categories WHERE habit_id = ? AND category_id = ?',
      [habitId, categoryId]
    );
    
    return result.affectedRows > 0;
  }
  
  /**
   * Get habits by category
   * @param {number} categoryId - The category ID
   * @returns {Promise<Array>} - Array of habits
   */
  static async getHabits(categoryId) {
    const [rows] = await pool.execute(
      `SELECT h.id, h.name, h.target_type, h.start_date, h.current_streak, h.longest_streak
       FROM habits h
       JOIN habit_categories hc ON h.id = hc.habit_id
       WHERE hc.category_id = ?
       ORDER BY h.created_at DESC`,
      [categoryId]
    );
    
    return rows;
  }
}

module.exports = Category;
