import api from "../api/axios";
import type { AxiosResponse } from "axios";
import { HABIT_ENDPOINTS, ACTIVITY_ENDPOINTS } from "../api/urls";

// Define interfaces for habit data
interface Habit {
  id: number;
  name: string;
  current_streak: number;
  longest_streak: number;
  created_at: string;
  updated_at: string;
}

// Define activity types
export type ActivityType =
  | "habit_completed"
  | "streak_milestone"
  | "habit_created"
  | "habit_updated"
  | "habit_deleted"
  | "reminder";

// Define activity interface
export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  relatedId?: number; // ID of related entity (habit, checkin, etc.)
  relatedName?: string; // Name of related entity
  streakCount?: number; // For streak milestones
}

// Helper function to format relative time
export const formatRelativeTime = (timestamp: string): string => {
  const now = new Date();
  const activityTime = new Date(timestamp);
  const diffMs = now.getTime() - activityTime.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 0) {
    if (diffDay === 1) return "Yesterday";
    if (diffDay < 7) return `${diffDay} days ago`;

    // Format as date for older activities
    return activityTime.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year:
        now.getFullYear() !== activityTime.getFullYear()
          ? "numeric"
          : undefined,
    });
  }

  if (diffHour > 0) return `${diffHour}h ago`;
  if (diffMin > 0) return `${diffMin}m ago`;
  return "Just now";
};

// Activity service
export const activityService = {
  /**
   * Get recent activities for the current user
   * @param limit - Maximum number of activities to return
   * @returns Promise with recent activities
   */
  getRecentActivities: async (limit: number = 5): Promise<Activity[]> => {
    try {
      // In a real implementation, this would be an API call to a dedicated endpoint
      // For now, we'll simulate by combining data from habits and checkins

      // Try to use the dedicated activity endpoint if it exists
      try {
        const response: AxiosResponse<Activity[]> = await api.get(
          `${ACTIVITY_ENDPOINTS.GET_RECENT}?limit=${limit}`
        );
        return response.data;
      } catch {
        // Fallback to simulation if the endpoint doesn't exist
        console.log(
          "Activity endpoint not available, using fallback simulation"
        );
      }

      // Get recent habits (for creation/update events)
      const habitsResponse: AxiosResponse<Habit[]> = await api.get(
        HABIT_ENDPOINTS.GET_ALL
      );
      const habits = habitsResponse.data;

      // Create activities from habits data
      const habitActivities: Activity[] = habits
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
      const streakActivities: Activity[] = habits
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

      // Simulate completed habit activities
      const completedActivities: Activity[] = habits
        .slice(0, limit)
        .map((habit, index) => {
          // Create a recent timestamp
          const timestamp = new Date();
          timestamp.setHours(timestamp.getHours() - index - 1);

          return {
            id: `habit-${habit.id}-completed-${timestamp.getTime()}`,
            type: "habit_completed",
            title: "Habit completed",
            description: `'${habit.name}' marked as completed`,
            timestamp: timestamp.toISOString(),
            relatedId: habit.id,
            relatedName: habit.name,
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
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error fetching recent activities:", errorMessage);
      return [];
    }
  },

  /**
   * Get all activities for the current user
   * @param limit - Maximum number of activities to return
   * @returns Promise with activities
   */
  getAllActivities: async (limit: number = 20): Promise<Activity[]> => {
    try {
      // Try to use the dedicated activity endpoint if it exists
      try {
        const response: AxiosResponse<Activity[]> = await api.get(
          `${ACTIVITY_ENDPOINTS.GET_ALL}?limit=${limit}`
        );
        return response.data;
      } catch (err) {
        console.log(
          "All activities endpoint not available, falling back to recent activities",
          err
        );
        // Fallback to getRecentActivities with a higher limit
        return activityService.getRecentActivities(limit);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error fetching all activities:", errorMessage);
      return [];
    }
  },

  /**
   * Get activities by type for the current user
   * @param type - Activity type to filter by
   * @param limit - Maximum number of activities to return
   * @returns Promise with filtered activities
   */
  getActivitiesByType: async (
    type: ActivityType,
    limit: number = 10
  ): Promise<Activity[]> => {
    try {
      // Try to use the dedicated activity by type endpoint if it exists
      try {
        const response: AxiosResponse<Activity[]> = await api.get(
          `${ACTIVITY_ENDPOINTS.GET_BY_TYPE(type)}?limit=${limit}`
        );
        return response.data;
      } catch (err) {
        console.log(
          `Activities by type endpoint not available for ${type}, using client-side filtering`,
          err
        );

        // Fallback to client-side filtering
        const allActivities = await activityService.getAllActivities(50);
        return allActivities
          .filter((activity) => activity.type === type)
          .slice(0, limit);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(`Error fetching activities by type ${type}:`, errorMessage);
      return [];
    }
  },
};
