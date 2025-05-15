import type { Habit } from "../services/habitService";

/**
 * Determines if a habit is scheduled for today based on its target type and target days
 * @param habit - The habit to check
 * @returns boolean - True if the habit is scheduled for today
 */
export const isHabitScheduledForToday = (habit: Habit): boolean => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Convert day of week to string format used in the API
  const dayMap: Record<number, string> = {
    0: "sun",
    1: "mon",
    2: "tue",
    3: "wed",
    4: "thu",
    5: "fri",
    6: "sat",
  };

  const todayString = dayMap[dayOfWeek];

  switch (habit.target_type) {
    case "daily":
      // Daily habits are scheduled every day
      return true;

    case "weekdays":
      // Weekdays are Monday through Friday (1-5)
      return dayOfWeek >= 1 && dayOfWeek <= 5;

    case "custom":
      // Custom habits are scheduled on specific days
      return habit.target_days?.includes(todayString) || false;

    default:
      return false;
  }
};

/**
 * Groups habits by time of day (Morning, Afternoon, Evening)
 * This is a placeholder implementation - in a real app, you might have a time_of_day field
 * @param habits - Array of habits to group
 * @returns Record<string, Habit[]> - Grouped habits
 */
export const groupHabitsByTimeOfDay = (
  habits: Habit[]
): Record<string, Habit[]> => {
  // For now, we'll use a simple algorithm based on habit name
  // In a real app, you'd have a specific field for this
  const groups: Record<string, Habit[]> = {
    Morning: [],
    Afternoon: [],
    Evening: [],
  };

  habits.forEach((habit) => {
    const name = habit.name.toLowerCase();

    if (
      name.includes("morning") ||
      name.includes("breakfast") ||
      name.includes("wake") ||
      name.includes("early")
    ) {
      groups["Morning"].push(habit);
    } else if (
      name.includes("evening") ||
      name.includes("night") ||
      name.includes("dinner") ||
      name.includes("sleep")
    ) {
      groups["Evening"].push(habit);
    } else {
      groups["Afternoon"].push(habit);
    }
  });

  return groups;
};

/**
 * Sorts habits by priority or time of day
 * @param habits - Array of habits to sort
 * @returns Habit[] - Sorted habits
 */
export const sortHabits = (habits: Habit[]): Habit[] => {
  // In a real app, you might have a priority field
  // For now, we'll sort alphabetically
  return [...habits].sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Formats a streak count with appropriate suffix
 * @param count - The streak count
 * @returns string - Formatted streak (e.g., "5 days")
 */
export const formatStreak = (count: number): string => {
  return `${count} ${count === 1 ? "day" : "days"}`;
};
