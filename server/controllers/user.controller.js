const { pool } = require('../config/database');
const userQueries = require('../db/queries/users.queries');

/**
 * Get current user's profile
 * @route GET /api/users/profile
 */
const getProfile = async (req, res) => {
  try {
    // User is already attached to request by auth middleware
    const { id, name, email, avatar } = req.user;
    
    res.json({
      id,
      name,
      email,
      avatar
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update user profile
 * @route PUT /api/users/profile
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, avatar } = req.body;
    
    // Update user
    await pool.execute(
      userQueries.updateUserProfile,
      [name || req.user.name, avatar || req.user.avatar, userId]
    );
    
    // Get updated user
    const [users] = await pool.execute(userQueries.findUserById, [userId]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const user = users[0];
    
    // Return updated user data (without password)
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error during profile update' });
  }
};

module.exports = {
  getProfile,
  updateProfile
}; 