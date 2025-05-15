import api from "../api/axios";
import type { AxiosResponse } from "axios";
import { HABIT_ENDPOINTS, CHECKIN_ENDPOINTS } from "../api/urls";

// Define interfaces for habit data
export interface Habit {
  id: number;
  name: string;
  target_type: "daily" | "weekdays" | "custom";
  start_date: string;
  current_streak: number;
  longest_streak: number;
  created_at: string;
  updated_at: string;
  target_days?: string[]; // Optional, only for custom habits
}

export interface HabitCheckin {
  id: number;
  habit_id: number;
  date: string;
  status: "completed" | "missed" | "skipped";
  created_at: string;
  updated_at: string;
}

export interface CreateHabitRequest {
  name: string;
  target_type: "daily" | "weekdays" | "custom";
  start_date: string;
  target_days?: string[]; // Required for custom target_type
}

export interface UpdateHabitRequest {
  name?: string;
  target_type?: "daily" | "weekdays" | "custom";
  target_days?: string[];
}

export interface CreateCheckinRequest {
  date: string;
  status: "completed" | "missed" | "skipped";
}

export interface BatchCheckinRequest {
  date: string;
  updates: {
    habit_id: number;
    status: "completed" | "missed" | "skipped";
  }[];
}

// Define the habit service
export const habitService = {
  /**
   * Get all habits for the current user
   * @returns Promise with array of habits
   */
  getAllHabits: async (): Promise<Habit[]> => {
    const response: AxiosResponse<Habit[]> = await api.get(
      HABIT_ENDPOINTS.GET_ALL
    );
    return response.data;
  },

  /**
   * Alias for getAllHabits for consistency
   * @returns Promise with array of habits
   */
  getAll: async (): Promise<Habit[]> => {
    return habitService.getAllHabits();
  },

  /**
   * Get a single habit by ID
   * @param id - Habit ID
   * @returns Promise with habit data
   */
  getHabitById: async (id: number): Promise<Habit> => {
    const response: AxiosResponse<Habit> = await api.get(
      HABIT_ENDPOINTS.GET_BY_ID(id)
    );
    return response.data;
  },

  /**
   * Create a new habit
   * @param habitData - Habit data to create
   * @returns Promise with created habit
   */
  createHabit: async (habitData: CreateHabitRequest): Promise<Habit> => {
    const response: AxiosResponse<Habit> = await api.post(
      HABIT_ENDPOINTS.CREATE,
      habitData
    );
    return response.data;
  },

  /**
   * Update an existing habit
   * @param id - Habit ID
   * @param habitData - Habit data to update
   * @returns Promise with updated habit
   */
  updateHabit: async (
    id: number,
    habitData: UpdateHabitRequest
  ): Promise<Habit> => {
    const response: AxiosResponse<Habit> = await api.put(
      HABIT_ENDPOINTS.UPDATE(id),
      habitData
    );
    return response.data;
  },

  /**
   * Delete a habit
   * @param id - Habit ID
   * @returns Promise with success status
   */
  deleteHabit: async (id: number): Promise<void> => {
    await api.delete(HABIT_ENDPOINTS.DELETE(id));
  },

  /**
   * Create or update a check-in for a habit
   * @param habitId - Habit ID
   * @param checkinData - Check-in data
   * @returns Promise with streak information
   */
  createCheckin: async (
    habitId: number,
    checkinData: CreateCheckinRequest
  ): Promise<{ current_streak: number; longest_streak: number }> => {
    const response: AxiosResponse<{
      current_streak: number;
      longest_streak: number;
    }> = await api.post(HABIT_ENDPOINTS.CREATE_CHECKIN(habitId), checkinData);
    return response.data;
  },

  /**
   * Get check-ins for a habit
   * @param habitId - Habit ID
   * @param startDate - Optional start date filter (YYYY-MM-DD)
   * @param endDate - Optional end date filter (YYYY-MM-DD)
   * @returns Promise with array of check-ins
   */
  getCheckins: async (
    habitId: number,
    startDate?: string,
    endDate?: string
  ): Promise<HabitCheckin[]> => {
    let url = HABIT_ENDPOINTS.GET_CHECKINS(habitId);

    // Add query parameters if provided
    const params = new URLSearchParams();
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);

    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;

    const response: AxiosResponse<HabitCheckin[]> = await api.get(url);
    return response.data;
  },

  /**
   * Get all check-ins for a specific date
   * This fetches checkins for all habits on a specific date in parallel
   * @param date - Date to get checkins for (YYYY-MM-DD)
   * @returns Promise with record of habit ID to checkin
   */
  getAllCheckinsByDate: async (
    date: string
  ): Promise<Record<number, HabitCheckin>> => {
    // Get all habits first
    const habits = await habitService.getAll();
    const checkinMap: Record<number, HabitCheckin> = {};

    // Use Promise.all for parallel requests to improve performance
    const promises = habits.map(async (habit) => {
      // try {
      const checkins = await habitService.getCheckins(habit.id, date, date);
      if (checkins.length > 0) {
        checkinMap[habit.id] = checkins[0];
      }
      // } catch (e) {
      // console.error(`Error fetching checkin for habit ${habit.id}:`, e);
      // }
    });

    await Promise.all(promises);
    return checkinMap;
  },

  /**
   * Batch update check-ins for multiple habits
   * @param batchData - Batch check-in data
   * @returns Promise with success status
   */
  batchUpdateCheckins: async (
    batchData: BatchCheckinRequest
  ): Promise<void> => {
    await api.post(CHECKIN_ENDPOINTS.BATCH_UPDATE, batchData);
  },

  /**
   * Get today's habits that need to be checked
   * @returns Promise with array of habits due today
   */
  getTodaysHabits: async (): Promise<Habit[]> => {
    // This is a helper method that filters habits based on their schedule
    // In a real implementation, you might want a dedicated endpoint for this
    const habits = await habitService.getAllHabits();
    const today = new Date();
    const dayOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][
      today.getDay()
    ];

    return habits.filter((habit) => {
      // For daily habits, always return true
      if (habit.target_type === "daily") return true;

      // For weekday habits, check if today is a weekday (Monday-Friday)
      if (habit.target_type === "weekdays") {
        const dayIndex = today.getDay();
        return dayIndex >= 1 && dayIndex <= 5; // 1 = Monday, 5 = Friday
      }

      // For custom habits, check if today is in the target days
      if (habit.target_type === "custom" && habit.target_days) {
        return habit.target_days.includes(dayOfWeek);
      }

      return false;
    });
  },
};
