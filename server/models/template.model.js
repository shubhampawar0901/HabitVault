const { pool } = require('../config/database');

class Template {
  /**
   * Get all templates
   * @returns {Promise<Array>} - Array of templates
   */
  static async getAll() {
    const [rows] = await pool.execute(
      `SELECT t.id, t.name, t.description, t.target_type, t.category_id, 
              c.name as category_name, c.color as category_color,
              t.created_at, t.updated_at
       FROM templates t
       LEFT JOIN categories c ON t.category_id = c.id
       ORDER BY t.name ASC`
    );
    
    // Get target days for custom templates
    for (const template of rows) {
      if (template.target_type === 'custom') {
        template.target_days = await this.getTargetDays(template.id);
      }
    }
    
    return rows;
  }
  
  /**
   * Get a template by ID
   * @param {number} id - The template ID
   * @returns {Promise<Object>} - Template object
   */
  static async getById(id) {
    const [rows] = await pool.execute(
      `SELECT t.id, t.name, t.description, t.target_type, t.category_id, 
              c.name as category_name, c.color as category_color,
              t.created_at, t.updated_at
       FROM templates t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.id = ?`,
      [id]
    );
    
    if (rows.length === 0) {
      return null;
    }
    
    const template = rows[0];
    
    // Get target days if custom
    if (template.target_type === 'custom') {
      template.target_days = await this.getTargetDays(template.id);
    }
    
    return template;
  }
  
  /**
   * Get target days for a template
   * @param {number} templateId - The template ID
   * @returns {Promise<Array>} - Array of target days
   */
  static async getTargetDays(templateId) {
    const [rows] = await pool.execute(
      `SELECT day
       FROM template_target_days
       WHERE template_id = ?`,
      [templateId]
    );
    
    return rows.map(row => row.day);
  }
  
  /**
   * Create a new template
   * @param {Object} templateData - The template data
   * @returns {Promise<number>} - The new template ID
   */
  static async create(templateData) {
    const { name, description, target_type, category_id, target_days } = templateData;
    
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Insert the template
      const [result] = await connection.execute(
        `INSERT INTO templates (name, description, target_type, category_id)
         VALUES (?, ?, ?, ?)`,
        [name, description, target_type, category_id]
      );
      
      const templateId = result.insertId;
      
      // Insert target days if custom
      if (target_type === 'custom' && Array.isArray(target_days) && target_days.length > 0) {
        const validDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        const filteredDays = target_days.filter(day => validDays.includes(day));
        
        for (const day of filteredDays) {
          await connection.execute(
            `INSERT INTO template_target_days (template_id, day)
             VALUES (?, ?)`,
            [templateId, day]
          );
        }
      }
      
      await connection.commit();
      connection.release();
      
      return templateId;
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  }
  
  /**
   * Update a template
   * @param {number} id - The template ID
   * @param {Object} templateData - The template data to update
   * @returns {Promise<boolean>} - Success status
   */
  static async update(id, templateData) {
    const { name, description, target_type, category_id, target_days } = templateData;
    
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Build update query based on provided fields
      let updateQuery = 'UPDATE templates SET ';
      const updateValues = [];
      
      if (name !== undefined) {
        updateQuery += 'name = ?, ';
        updateValues.push(name);
      }
      
      if (description !== undefined) {
        updateQuery += 'description = ?, ';
        updateValues.push(description);
      }
      
      if (target_type !== undefined) {
        updateQuery += 'target_type = ?, ';
        updateValues.push(target_type);
      }
      
      if (category_id !== undefined) {
        updateQuery += 'category_id = ?, ';
        updateValues.push(category_id);
      }
      
      // Only execute update if there are fields to update
      if (updateValues.length > 0) {
        // Remove trailing comma and space
        updateQuery = updateQuery.slice(0, -2);
        updateQuery += ' WHERE id = ?';
        updateValues.push(id);
        
        await connection.execute(updateQuery, updateValues);
      }
      
      // Update target days if provided and target_type is or will be custom
      if (target_days !== undefined) {
        // Get current target_type if not provided in update
        let targetType = target_type;
        if (targetType === undefined) {
          const [templates] = await connection.execute(
            'SELECT target_type FROM templates WHERE id = ?',
            [id]
          );
          
          if (templates.length === 0) {
            throw new Error('Template not found');
          }
          
          targetType = templates[0].target_type;
        }
        
        if (targetType === 'custom') {
          // Delete existing target days
          await connection.execute(
            'DELETE FROM template_target_days WHERE template_id = ?',
            [id]
          );
          
          // Insert new target days
          if (Array.isArray(target_days) && target_days.length > 0) {
            const validDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
            const filteredDays = target_days.filter(day => validDays.includes(day));
            
            for (const day of filteredDays) {
              await connection.execute(
                'INSERT INTO template_target_days (template_id, day) VALUES (?, ?)',
                [id, day]
              );
            }
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
   * Delete a template
   * @param {number} id - The template ID
   * @returns {Promise<boolean>} - Success status
   */
  static async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM templates WHERE id = ?',
      [id]
    );
    
    return result.affectedRows > 0;
  }
  
  /**
   * Create a habit from a template
   * @param {number} templateId - The template ID
   * @param {number} userId - The user ID
   * @param {string} startDate - The start date (YYYY-MM-DD)
   * @returns {Promise<number>} - The new habit ID
   */
  static async createHabitFromTemplate(templateId, userId, startDate) {
    const template = await this.getById(templateId);
    
    if (!template) {
      throw new Error('Template not found');
    }
    
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Insert the habit
      const [result] = await connection.execute(
        `INSERT INTO habits (user_id, name, target_type, start_date)
         VALUES (?, ?, ?, ?)`,
        [userId, template.name, template.target_type, startDate]
      );
      
      const habitId = result.insertId;
      
      // Insert target days if custom
      if (template.target_type === 'custom' && template.target_days && template.target_days.length > 0) {
        for (const day of template.target_days) {
          await connection.execute(
            `INSERT INTO habit_target_days (habit_id, day)
             VALUES (?, ?)`,
            [habitId, day]
          );
        }
      }
      
      // Add category if present
      if (template.category_id) {
        await connection.execute(
          `INSERT INTO habit_categories (habit_id, category_id)
           VALUES (?, ?)`,
          [habitId, template.category_id]
        );
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
}

module.exports = Template;
