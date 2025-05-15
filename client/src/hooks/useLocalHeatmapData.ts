import { useState, useEffect, useCallback, useRef } from "react";
import {
  analyticsService,
  type HeatmapData,
} from "../services/analyticsService";

interface UseLocalHeatmapDataResult {
  localData: HeatmapData | null;
  isLoading: boolean;
  error: string | null;
  currentMonth: number;
  currentYear: number;
  navigateToPrevMonth: () => void;
  navigateToNextMonth: () => void;
}

/**
 * Custom hook for managing heatmap data locally with caching
 * This allows for smooth navigation between months without affecting the parent component
 */
export const useLocalHeatmapData = (
  initialData: HeatmapData | null,
  initialMonth: number = new Date().getMonth(),
  initialYear: number = new Date().getFullYear(),
  period?: "daily" | "weekly" | "monthly" | "yearly"
): UseLocalHeatmapDataResult => {
  // State for current month and year
  const [currentMonth, setCurrentMonth] = useState<number>(initialMonth);
  const [currentYear, setCurrentYear] = useState<number>(initialYear);
  
  // State for local heatmap data
  const [localData, setLocalData] = useState<HeatmapData | null>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Cache for storing fetched data by month/year
  const [cachedMonths, setCachedMonths] = useState<Record<string, HeatmapData>>({});
  
  // Generate cache key for a month/year
  const getCacheKey = useCallback((month: number, year: number) => {
    return `${year}-${month + 1}`;
  }, []);

  // Initialize with initial data
  useEffect(() => {
    if (initialData) {
      setLocalData(initialData);
      // Cache the initial data
      const cacheKey = getCacheKey(initialMonth, initialYear);
      setCachedMonths(prev => ({
        ...prev,
        [cacheKey]: initialData
      }));
    }
  }, [initialData, initialMonth, initialYear, getCacheKey]);

  // Fetch data for a specific month
  const fetchMonthData = useCallback(async (month: number, year: number) => {
    const cacheKey = getCacheKey(month, year);
    
    // Check if data is already cached
    if (cachedMonths[cacheKey]) {
      setLocalData(cachedMonths[cacheKey]);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Calculate date range for the month
      const firstDayOfMonth = new Date(year, month, 1);
      const lastDayOfMonth = new Date(year, month + 1, 0);
      
      // Format dates as YYYY-MM-DD strings
      const startDate = firstDayOfMonth.toISOString().split('T')[0];
      const endDate = lastDayOfMonth.toISOString().split('T')[0];
      
      // Fetch data from API
      const data = await analyticsService.getHeatmap(startDate, endDate, period);
      
      // Update cache
      setCachedMonths(prev => ({
        ...prev,
        [cacheKey]: data
      }));
      
      // Update local data
      setLocalData(data);
    } catch (error) {
      console.error("Error fetching heatmap data:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch heatmap data";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [cachedMonths, getCacheKey, period]);

  // Fetch data when month/year changes
  useEffect(() => {
    fetchMonthData(currentMonth, currentYear);
  }, [currentMonth, currentYear, fetchMonthData]);

  // Navigation functions
  const navigateToPrevMonth = useCallback(() => {
    if (isLoading) return;
    
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  }, [currentMonth, currentYear, isLoading]);

  const navigateToNextMonth = useCallback(() => {
    if (isLoading) return;
    
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  }, [currentMonth, currentYear, isLoading]);

  return {
    localData,
    isLoading,
    error,
    currentMonth,
    currentYear,
    navigateToPrevMonth,
    navigateToNextMonth
  };
};
