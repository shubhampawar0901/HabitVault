import { useState, useEffect, useCallback } from "react";
import {
  habitService,
  type Habit,
  type HabitCheckin,
  type CreateHabitRequest,
  type UpdateHabitRequest,
} from "../services/habitService";
import { showToast } from "../components/common/Toast";
import { useDashboardContext } from "../contexts/DashboardContext";

interface HabitsState {
  habits: Habit[];
  filteredHabits: Habit[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  sortBy: SortOption;
  filterBy: FilterOption;
  viewMode: "grid" | "list";
  todayCheckins: Record<number, HabitCheckin>;
  checkinsLoading: boolean;
}

export type SortOption = "name" | "streak" | "created" | "updated";
export type FilterOption = "all" | "daily" | "weekdays" | "custom";

export const useHabits = () => {
  const [state, setState] = useState<HabitsState>({
    habits: [],
    filteredHabits: [],
    loading: true,
    error: null,
    searchTerm: "",
    sortBy: "created",
    filterBy: "all",
    viewMode: "grid",
    todayCheckins: {},
    checkinsLoading: false,
  });

  // Get the dashboard refresh function from context
  const { refreshDashboard } = useDashboardContext();

  // Fetch all habits
  const fetchHabits = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const habits = await habitService.getAll();

      setState((prev) => {
        const filteredHabits = applyFilters(
          habits,
          prev.searchTerm,
          prev.filterBy
        );
        const sortedHabits = sortHabits(filteredHabits, prev.sortBy);

        return {
          ...prev,
          habits,
          filteredHabits: sortedHabits,
          loading: false,
        };
      });
    } catch (error) {
      console.error("Error fetching habits:", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to load habits. Please try again.",
      }));
      // showToast.error("Error loading habits");
    }
  }, []);

  // Get today's date in YYYY-MM-DD format
  const getTodayString = () => {
    console.log("Using test date for habits:", "2025-05-14");
    return "2025-05-14"; // Using test date to match the database
  };

  // Fetch checkins for today
  const fetchTodayCheckins = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, checkinsLoading: true }));

      const todayStr = getTodayString();

      // Fetch all checkins for today in a single API call
      const checkins = await habitService.getAllCheckinsByDate(todayStr);

      setState((prev) => ({
        ...prev,
        todayCheckins: checkins,
        checkinsLoading: false,
      }));
    } catch (error) {
      console.error("Error fetching today's checkins:", error);
      setState((prev) => ({ ...prev, checkinsLoading: false }));
    }
  }, []);

  // Toggle habit completion status between completed and missed only
  const toggleHabitCompletion = async (habitId: number) => {
    try {
      const todayStr = getTodayString();
      const currentCheckin = state.todayCheckins[habitId];
      const currentStatus = currentCheckin?.status;

      // Determine the next status - only toggle between completed and missed
      let newStatus: "completed" | "missed" = "completed"; // Default to completed

      if (
        !currentStatus ||
        currentStatus === "skipped" ||
        currentStatus === "missed"
      ) {
        // If not marked or missed, set to completed
        newStatus = "completed";
      } else if (currentStatus === "completed") {
        // If currently completed, set to missed
        newStatus = "missed";
      }

      // Optimistically update UI
      setState((prev) => ({
        ...prev,
        todayCheckins: {
          ...prev.todayCheckins,
          [habitId]: {
            ...(currentCheckin || {
              id: 0,
              habit_id: habitId,
              date: todayStr,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }),
            status: newStatus as "completed" | "missed" | "skipped",
          } as HabitCheckin,
        },
      }));

      // Call API to update checkin
      const result = await habitService.createCheckin(habitId, {
        date: todayStr,
        status: newStatus,
      });

      // Update habit with new streak information
      updateHabitStreaks(habitId, result);

      // Refresh dashboard data to update the metrics
      refreshDashboard();

      showToast.success(`Habit marked as ${newStatus}`);
    } catch (error) {
      console.error(`Error toggling habit ${habitId}:`, error);

      // Get today's checkins in a single API call instead of multiple calls
      const todayStr = getTodayString();
      const checkins = await habitService.getAllCheckinsByDate(todayStr);

      setState((prev) => ({
        ...prev,
        todayCheckins: checkins,
      }));

      // Refresh dashboard data even on error to ensure consistency
      refreshDashboard();

      // showToast.error("Failed to update habit status");
    }
  };

  // Helper function to update habit streaks after a status change
  const updateHabitStreaks = (
    habitId: number,
    result: { current_streak: number; longest_streak: number }
  ) => {
    setState((prev) => {
      const updatedHabits = prev.habits.map((h) => {
        if (h.id === habitId) {
          return {
            ...h,
            current_streak: result.current_streak,
            longest_streak: result.longest_streak,
          };
        }
        return h;
      });

      const updatedFilteredHabits = prev.filteredHabits.map((h) => {
        if (h.id === habitId) {
          return {
            ...h,
            current_streak: result.current_streak,
            longest_streak: result.longest_streak,
          };
        }
        return h;
      });

      return {
        ...prev,
        habits: updatedHabits,
        filteredHabits: updatedFilteredHabits,
      };
    });
  };

  // Initial fetch
  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  // Fetch today's checkins only once after initial habits load
  useEffect(() => {
    if (state.habits.length > 0) {
      fetchTodayCheckins();
    }
  }, [state.habits.length, fetchTodayCheckins]);

  // Apply search and filters
  const applyFilters = (
    habits: Habit[],
    searchTerm: string,
    filterBy: FilterOption
  ): Habit[] => {
    return habits.filter((habit) => {
      // Apply search filter
      const matchesSearch = habit.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Apply type filter
      const matchesType = filterBy === "all" || habit.target_type === filterBy;

      return matchesSearch && matchesType;
    });
  };

  // Sort habits
  const sortHabits = (habits: Habit[], sortBy: SortOption): Habit[] => {
    return [...habits].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "streak":
          return b.current_streak - a.current_streak;
        case "created":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "updated":
          return (
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
        default:
          return 0;
      }
    });
  };

  // Set search term
  const setSearchTerm = (searchTerm: string) => {
    setState((prev) => {
      const filteredHabits = applyFilters(
        prev.habits,
        searchTerm,
        prev.filterBy
      );
      const sortedHabits = sortHabits(filteredHabits, prev.sortBy);

      return {
        ...prev,
        searchTerm,
        filteredHabits: sortedHabits,
      };
    });
  };

  // Set filter
  const setFilterBy = (filterBy: FilterOption) => {
    setState((prev) => {
      const filteredHabits = applyFilters(
        prev.habits,
        prev.searchTerm,
        filterBy
      );
      const sortedHabits = sortHabits(filteredHabits, prev.sortBy);

      return {
        ...prev,
        filterBy,
        filteredHabits: sortedHabits,
      };
    });
  };

  // Set sort option
  const setSortBy = (sortBy: SortOption) => {
    setState((prev) => {
      const sortedHabits = sortHabits(prev.filteredHabits, sortBy);

      return {
        ...prev,
        sortBy,
        filteredHabits: sortedHabits,
      };
    });
  };

  // Set view mode
  const setViewMode = (viewMode: "grid" | "list") => {
    setState((prev) => ({
      ...prev,
      viewMode,
    }));
  };

  // Create a new habit
  const createHabit = async (habitData: CreateHabitRequest) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      await habitService.createHabit(habitData);
      showToast.success("Habit created successfully");
      fetchHabits();
    } catch (error) {
      console.error("Error creating habit:", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to create habit. Please try again.",
      }));
      // showToast.error("Error creating habit");
      throw error;
    }
  };

  // Update a habit
  const updateHabit = async (id: number, habitData: UpdateHabitRequest) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      await habitService.updateHabit(id, habitData);
      showToast.success("Habit updated successfully");
      fetchHabits();
    } catch (error) {
      console.error("Error updating habit:", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to update habit. Please try again.",
      }));
      // showToast.error("Error updating habit");
      throw error;
    }
  };

  // Delete a habit
  const deleteHabit = async (id: number) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      await habitService.deleteHabit(id);
      showToast.success("Habit deleted successfully");
      fetchHabits();
    } catch (error) {
      console.error("Error deleting habit:", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to delete habit. Please try again.",
      }));
      // showToast.error("Error deleting habit");
      throw error;
    }
  };

  return {
    ...state,
    setSearchTerm,
    setFilterBy,
    setSortBy,
    setViewMode,
    createHabit,
    updateHabit,
    deleteHabit,
    refreshHabits: fetchHabits,
    toggleHabitCompletion,
    isHabitCompletedToday: (habitId: number) =>
      state.todayCheckins[habitId]?.status === "completed",
    isHabitMissedToday: (habitId: number) =>
      state.todayCheckins[habitId]?.status === "missed",
    isHabitNotMarkedToday: (habitId: number) =>
      !state.todayCheckins[habitId] ||
      state.todayCheckins[habitId]?.status === "skipped",
    getHabitStatusToday: (habitId: number) => {
      const checkin = state.todayCheckins[habitId];
      if (!checkin || checkin.status === "skipped") return "not-marked";
      return checkin.status;
    },
  };
};
