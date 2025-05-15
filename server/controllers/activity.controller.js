const Habit = require('../models/habit.model');
const Checkin = require('../models/checkin.model');

/**
 * Get recent activities for the current user
 * @route GET /api/activities/recent
 */
const getRecentActivities = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 5;

    // Get recent habits (for creation/update events)
    const habits = await Habit.findAllByUserId(userId);

    // Create activities from habits data
    const habitActivities = habits
      .slice(0, limit)
      .map((habit, index) => {
        // Use creation date for new habits
        const createdAt = new Date(habit.created_at);
        // For demo purposes, stagger the timestamps to create a timeline
        createdAt.setHours(createdAt.getHours() - index * 2);

        return {
          id: `habit-${habit.id}-created`,
          type: "habit_created",
          title: "New habit created",
          description: `Started tracking '${habit.name}'`,
          timestamp: createdAt.toISOString(),
          relatedId: habit.id,
          relatedName: habit.name,
        };
      });

    // Simulate streak milestone activities
    const streakActivities = habits
      .filter((habit) => habit.current_streak >= 7)
      .slice(0, limit)
      .map((habit, index) => {
        // Create a timestamp a bit older than the habit creation
        const timestamp = new Date(habit.created_at);
        timestamp.setHours(timestamp.getHours() - (index + 1) * 4);

        return {
          id: `habit-${habit.id}-streak-${habit.current_streak}`,
          type: "streak_milestone",
          title: "New streak milestone",
          description: `${habit.current_streak}-day streak achieved for '${habit.name}'`,
          timestamp: timestamp.toISOString(),
          relatedId: habit.id,
          relatedName: habit.name,
          streakCount: habit.current_streak,
        };
      });

    // Get recent checkins - ensure limit is a number
    const recentCheckins = await Checkin.getRecentByUserId(userId, parseInt(limit, 10));

    // Create completed habit activities from checkins
    const completedActivities = recentCheckins.map((checkin) => {
      return {
        id: `habit-${checkin.habit_id}-completed-${new Date(checkin.date).getTime()}`,
        type: "habit_completed",
        title: "Habit completed",
        description: `'${checkin.habit_name}' marked as completed`,
        timestamp: new Date(checkin.date).toISOString(),
        relatedId: checkin.habit_id,
        relatedName: checkin.habit_name,
      };
    });

    // Combine all activities and sort by timestamp (newest first)
    const allActivities = [
      ...habitActivities,
      ...streakActivities,
      ...completedActivities,
    ].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Return limited number of activities
    res.json(allActivities.slice(0, limit));
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get all activities for the current user
 * @route GET /api/activities
 */
const getAllActivities = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 20;

    // This is a simplified version that just returns more activities
    // In a real implementation, this would include pagination

    // Call the same function but with a higher limit
    const activities = await getRecentActivitiesData(userId, limit);

    res.json(activities);
  } catch (error) {
    console.error('Error fetching all activities:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get activities by type for the current user
 * @route GET /api/activities/type/:type
 */
const getActivitiesByType = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    // Validate type
    const validTypes = [
      "habit_completed",
      "streak_milestone",
      "habit_created",
      "habit_updated",
      "habit_deleted",
      "reminder"
    ];

    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid activity type' });
    }

    // Get all activities
    const allActivities = await getRecentActivitiesData(userId, 50);

    // Filter by type and limit
    const filteredActivities = allActivities
      .filter(activity => activity.type === type)
      .slice(0, limit);

    res.json(filteredActivities);
  } catch (error) {
    console.error('Error fetching activities by type:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Helper function to get recent activities data
 * @param {number} userId - User ID
 * @param {number} limit - Maximum number of activities to return
 * @returns {Promise<Array>} - Array of activities
 */
async function getRecentActivitiesData(userId, limit) {
  // Get recent habits (for creation/update events)
  const habits = await Habit.findAllByUserId(userId);

  // Create activities from habits data (same as in getRecentActivities)
  const habitActivities = habits
    .slice(0, limit)
    .map((habit, index) => {
      const createdAt = new Date(habit.created_at);
      createdAt.setHours(createdAt.getHours() - index * 2);

      return {
        id: `habit-${habit.id}-created`,
        type: "habit_created",
        title: "New habit created",
        description: `Started tracking '${habit.name}'`,
        timestamp: createdAt.toISOString(),
        relatedId: habit.id,
        relatedName: habit.name,
      };
    });

  // Simulate streak milestone activities
  const streakActivities = habits
    .filter((habit) => habit.current_streak >= 7)
    .slice(0, limit)
    .map((habit, index) => {
      const timestamp = new Date(habit.created_at);
      timestamp.setHours(timestamp.getHours() - (index + 1) * 4);

      return {
        id: `habit-${habit.id}-streak-${habit.current_streak}`,
        type: "streak_milestone",
        title: "New streak milestone",
        description: `${habit.current_streak}-day streak achieved for '${habit.name}'`,
        timestamp: timestamp.toISOString(),
        relatedId: habit.id,
        relatedName: habit.name,
        streakCount: habit.current_streak,
      };
    });

  // Get recent checkins - ensure limit is a number
  const recentCheckins = await Checkin.getRecentByUserId(userId, parseInt(limit, 10));

  // Create completed habit activities from checkins
  const completedActivities = recentCheckins.map((checkin) => {
    return {
      id: `habit-${checkin.habit_id}-completed-${new Date(checkin.date).getTime()}`,
      type: "habit_completed",
      title: "Habit completed",
      description: `'${checkin.habit_name}' marked as completed`,
      timestamp: new Date(checkin.date).toISOString(),
      relatedId: checkin.habit_id,
      relatedName: checkin.habit_name,
    };
  });

  // Combine all activities and sort by timestamp (newest first)
  const allActivities = [
    ...habitActivities,
    ...streakActivities,
    ...completedActivities,
  ].sort(
    (a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Return limited number of activities
  return allActivities.slice(0, limit);
}

module.exports = {
  getRecentActivities,
  getAllActivities,
  getActivitiesByType
};
