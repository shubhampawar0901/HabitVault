const Template = require('../models/template.model');
const Habit = require('../models/habit.model');

/**
 * Get all templates
 * @route GET /api/templates
 */
const getAllTemplates = async (req, res) => {
  try {
    const templates = await Template.getAll();
    res.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get a single template by ID
 * @route GET /api/templates/:id
 */
const getTemplateById = async (req, res) => {
  try {
    const templateId = req.params.id;
    
    const template = await Template.getById(templateId);
    
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    res.json(template);
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Create a new template
 * @route POST /api/templates
 */
const createTemplate = async (req, res) => {
  try {
    const { name, description, target_type, category_id, target_days } = req.body;
    
    if (!name || !target_type) {
      return res.status(400).json({ message: 'Name and target type are required' });
    }
    
    // Validate target_type
    if (!['daily', 'weekdays', 'custom'].includes(target_type)) {
      return res.status(400).json({ message: 'Invalid target type' });
    }
    
    // Validate target_days if target_type is custom
    if (target_type === 'custom' && (!target_days || !Array.isArray(target_days) || target_days.length === 0)) {
      return res.status(400).json({ message: 'Target days are required for custom target type' });
    }
    
    const templateId = await Template.create({
      name,
      description,
      target_type,
      category_id,
      target_days
    });
    
    const template = await Template.getById(templateId);
    
    res.status(201).json(template);
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update a template
 * @route PUT /api/templates/:id
 */
const updateTemplate = async (req, res) => {
  try {
    const templateId = req.params.id;
    const { name, description, target_type, category_id, target_days } = req.body;
    
    const template = await Template.getById(templateId);
    
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    // Validate target_type if provided
    if (target_type && !['daily', 'weekdays', 'custom'].includes(target_type)) {
      return res.status(400).json({ message: 'Invalid target type' });
    }
    
    // Validate target_days if target_type is or will be custom
    const newTargetType = target_type || template.target_type;
    if (newTargetType === 'custom' && target_days !== undefined && 
        (!Array.isArray(target_days) || target_days.length === 0)) {
      return res.status(400).json({ message: 'Target days are required for custom target type' });
    }
    
    await Template.update(templateId, {
      name,
      description,
      target_type,
      category_id,
      target_days
    });
    
    const updatedTemplate = await Template.getById(templateId);
    
    res.json(updatedTemplate);
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete a template
 * @route DELETE /api/templates/:id
 */
const deleteTemplate = async (req, res) => {
  try {
    const templateId = req.params.id;
    
    const template = await Template.getById(templateId);
    
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    await Template.delete(templateId);
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Create a habit from a template
 * @route POST /api/templates/:id/create-habit
 */
const createHabitFromTemplate = async (req, res) => {
  try {
    const templateId = req.params.id;
    const userId = req.user.id;
    const { start_date } = req.body;
    
    if (!start_date) {
      return res.status(400).json({ message: 'Start date is required' });
    }
    
    const template = await Template.getById(templateId);
    
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    const habitId = await Template.createHabitFromTemplate(templateId, userId, start_date);
    
    const habit = await Habit.findByIdAndUserId(habitId, userId);
    
    // Add target days to response if custom
    if (habit.target_type === 'custom') {
      habit.target_days = await Habit.getTargetDays(habitId);
    }
    
    res.status(201).json(habit);
  } catch (error) {
    console.error('Error creating habit from template:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  createHabitFromTemplate
};
