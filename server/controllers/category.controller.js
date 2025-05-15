const Category = require('../models/category.model');
const Habit = require('../models/habit.model');

/**
 * Get all categories
 * @route GET /api/categories
 */
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.getAll();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get a single category by ID
 * @route GET /api/categories/:id
 */
const getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;
    
    const category = await Category.getById(categoryId);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Create a new category
 * @route POST /api/categories
 */
const createCategory = async (req, res) => {
  try {
    const { name, color } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    
    const categoryId = await Category.create({ name, color });
    const category = await Category.getById(categoryId);
    
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update a category
 * @route PUT /api/categories/:id
 */
const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, color } = req.body;
    
    const category = await Category.getById(categoryId);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    const updated = await Category.update(categoryId, { name, color });
    
    if (!updated) {
      return res.status(400).json({ message: 'No fields to update' });
    }
    
    const updatedCategory = await Category.getById(categoryId);
    
    res.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete a category
 * @route DELETE /api/categories/:id
 */
const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    
    const category = await Category.getById(categoryId);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    await Category.delete(categoryId);
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get categories for a habit
 * @route GET /api/habits/:id/categories
 */
const getHabitCategories = async (req, res) => {
  try {
    const habitId = req.params.id;
    const userId = req.user.id;
    
    // Verify habit belongs to user
    const habit = await Habit.findByIdAndUserId(habitId, userId);
    
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    
    const categories = await Category.getForHabit(habitId);
    
    res.json(categories);
  } catch (error) {
    console.error('Error fetching habit categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Add categories to a habit
 * @route POST /api/habits/:id/categories
 */
const addHabitCategories = async (req, res) => {
  try {
    const habitId = req.params.id;
    const userId = req.user.id;
    const { category_ids } = req.body;
    
    if (!category_ids || !Array.isArray(category_ids) || category_ids.length === 0) {
      return res.status(400).json({ message: 'Category IDs are required' });
    }
    
    // Verify habit belongs to user
    const habit = await Habit.findByIdAndUserId(habitId, userId);
    
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    
    await Category.addToHabit(habitId, category_ids);
    
    const categories = await Category.getForHabit(habitId);
    
    res.json(categories);
  } catch (error) {
    console.error('Error adding habit categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Remove a category from a habit
 * @route DELETE /api/habits/:habitId/categories/:categoryId
 */
const removeHabitCategory = async (req, res) => {
  try {
    const habitId = req.params.habitId;
    const categoryId = req.params.categoryId;
    const userId = req.user.id;
    
    // Verify habit belongs to user
    const habit = await Habit.findByIdAndUserId(habitId, userId);
    
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    
    await Category.removeFromHabit(habitId, categoryId);
    
    res.status(204).send();
  } catch (error) {
    console.error('Error removing habit category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get habits by category
 * @route GET /api/categories/:id/habits
 */
const getCategoryHabits = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const userId = req.user.id;
    
    // Get all habits for this category
    const habits = await Category.getHabits(categoryId);
    
    // Filter habits to only include those belonging to the user
    const userHabits = [];
    for (const habit of habits) {
      const userHabit = await Habit.findByIdAndUserId(habit.id, userId);
      if (userHabit) {
        userHabits.push(habit);
      }
    }
    
    res.json(userHabits);
  } catch (error) {
    console.error('Error fetching category habits:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getHabitCategories,
  addHabitCategories,
  removeHabitCategory,
  getCategoryHabits
};
