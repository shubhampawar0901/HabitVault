import { useState, useEffect } from "react";
import { analyticsService } from "../services/analyticsService";
import { quoteService, type Quote } from "../services/quoteService";

interface TrendData {
  value: string;
  type: "positive" | "negative" | "neutral";
}

interface DashboardData {
  totalHabits: number;
  activeStreaks: number;
  completedToday: number;
  completionRate: number;
  longestStreak: number;
  weeklyProgress: number;
  quote: Quote | null;
  loading: boolean;
  error: string | null;
  // Trend data
  weeklyProgressTrend: TrendData;
  longestStreakTrend: TrendData;
  completionRateTrend: TrendData;
  completedTodayTrend: TrendData;
  // Function to refresh dashboard data
  refreshData: () => Promise<void>;
}

// Helper function to generate trend data
const generateTrendData = (
  current: number,
  previous: number,
  unit: string = ""
): TrendData => {
  if (previous === 0) return { value: "New", type: "neutral" };

  const difference = current - previous;
  const percentChange = previous !== 0 ? (difference / previous) * 100 : 0;

  if (difference === 0) {
    return { value: "No change", type: "neutral" };
  }

  const type = difference > 0 ? "positive" : "negative";
  const prefix = difference > 0 ? "+" : "";

  // Format the trend value based on the unit
  let value = "";
  if (unit === "%") {
    // For percentage values, show the percentage point difference
    value = `${prefix}${Math.abs(Math.round(difference))}${unit}`;
  } else if (unit === "days") {
    // For day values, show the day difference
    value = `${prefix}${Math.abs(difference)} ${unit}`;
  } else if (unit === "count") {
    // For count values, just show the difference
    value = `${prefix}${Math.abs(difference)}`;
  } else {
    // Default case, show percentage change
    value = `${prefix}${Math.abs(Math.round(percentChange))}%`;
  }

  return { value, type };
};

export const useDashboardData = (): DashboardData => {
  // Define state without the refreshData function
  const [state, setState] = useState<Omit<DashboardData, "refreshData">>({
    totalHabits: 0,
    activeStreaks: 0,
    completedToday: 0,
    completionRate: 0,
    longestStreak: 0,
    weeklyProgress: 0,
    quote: null,
    loading: true,
    error: null,
    // Initialize trend data with neutral values
    weeklyProgressTrend: { value: "Loading...", type: "neutral" },
    longestStreakTrend: { value: "Loading...", type: "neutral" },
    completionRateTrend: { value: "Loading...", type: "neutral" },
    completedTodayTrend: { value: "Loading...", type: "neutral" },
  });

  // Define the fetch function outside of useEffect so we can reuse it
  const fetchDashboardData = async () => {
    try {
      //console.log("Fetching dashboard data...");

      // Set loading state, but only for initial load
      // For refreshes, we don't want to show loading state to avoid flickering
      if (state.totalHabits === 0) {
        setState((prev) => ({ ...prev, loading: true }));
      }

      // Fetch completed habits for today first (most important for immediate feedback)
      
      const completedToday = await analyticsService.getCompletedTodayCount();
      
      // Update just the completedToday value immediately for faster feedback
      setState((prev) => ({
        ...prev,
        completedToday,
        // Keep loading true until we get all data
      }));

      // Fetch the rest of the data in parallel
      
      const [summary, activeStreaks, quote] = await Promise.all([
        analyticsService.getSummary(),
        analyticsService.getActiveStreaksCount(),
        quoteService.getDailyQuote(),
      ]);

      // Calculate weekly progress (this is a placeholder - in a real app, you'd have a specific endpoint or calculation)
      // For now, we'll use the completion rate as a proxy
      const weeklyProgress = summary.completion_rate;

      // In a real application, you would fetch previous values from an API
      // For this example, we'll simulate previous values
      const previousWeeklyProgress = weeklyProgress - 5; // Simulate 5% increase
      const previousLongestStreak = summary.longest_streak - 2; // Simulate 2 days increase
      const previousCompletionRate = summary.completion_rate - 3; // Simulate 3% increase
      const previousCompletedToday = completedToday - 2; // Simulate 2 more completed today

      // Generate trend data
      const weeklyProgressTrend = generateTrendData(
        weeklyProgress,
        previousWeeklyProgress,
        "%"
      );
      const longestStreakTrend = generateTrendData(
        summary.longest_streak,
        previousLongestStreak,
        "days"
      );
      const completionRateTrend = generateTrendData(
        summary.completion_rate,
        previousCompletionRate,
        "%"
      );
      const completedTodayTrend = generateTrendData(
        completedToday,
        previousCompletedToday,
        "count"
      );

      setState({
        totalHabits: summary.total_habits,
        activeStreaks,
        completedToday,
        completionRate: summary.completion_rate,
        longestStreak: summary.longest_streak,
        weeklyProgress,
        quote: quote,
        loading: false,
        error: null,
        // Set trend data
        weeklyProgressTrend,
        longestStreakTrend,
        completionRateTrend,
        completedTodayTrend,
      });
    } catch (error) {
      // console.error("Error fetching dashboard data:", error);
      setState((prevData) => ({
        ...prevData,
        loading: false,
        error: "Failed to load dashboard data. Please try again later.",
        // Set neutral trend data on error
        weeklyProgressTrend: { value: "N/A", type: "neutral" },
        longestStreakTrend: { value: "N/A", type: "neutral" },
        completionRateTrend: { value: "N/A", type: "neutral" },
        completedTodayTrend: { value: "N/A", type: "neutral" },
      }));
      //showToast.error("Failed to load dashboard data");
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Combine state with the refresh function to create the complete DashboardData object
  const data: DashboardData = {
    ...state,
    refreshData: fetchDashboardData,
  };

  return data;
};
