import { useState, useEffect, useCallback, useMemo } from "react";
import {
  activityService,
  type Activity,
  type ActivityType,
} from "../services/activityService";

interface UseActivitiesOptions {
  initialLimit?: number;
  initialPage?: number;
  initialType?: ActivityType | "all";
  initialDateRange?: { startDate: Date | null; endDate: Date | null };
}

export const useActivities = (options: UseActivitiesOptions = {}) => {
  const {
    initialLimit = 10,
    initialPage = 1,
    initialType = "all",
    initialDateRange = { startDate: null, endDate: null },
  } = options;

  // State for all fetched activities (before pagination/filtering)
  const [allActivities, setAllActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [type, setType] = useState<ActivityType | "all">(initialType);
  const [dateRange, setDateRange] = useState(initialDateRange);

  // Fetch activities based on type
  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let result: Activity[];

      if (type !== "all") {
        // Fetch activities by type
        result = await activityService.getActivitiesByType(
          type as ActivityType,
          50 // Fetch more to allow for client-side filtering
        );
      } else {
        // Fetch all activities
        result = await activityService.getAllActivities(50);
      }

      setAllActivities(result);
    } catch (err) {
      console.error("Error fetching activities:", err);
      setError("Failed to load activities");
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  // Apply client-side filtering and pagination
  const filteredAndPaginatedActivities = useMemo(() => {
    // Apply date range filter if provided
    let filtered = allActivities;

    if (dateRange.startDate && dateRange.endDate) {
      const startTime = dateRange.startDate.getTime();
      const endTime = dateRange.endDate.getTime();

      filtered = filtered.filter((activity) => {
        const activityTime = new Date(activity.timestamp).getTime();
        return activityTime >= startTime && activityTime <= endTime;
      });
    }

    // Calculate total for pagination
    const total = filtered.length;

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const paginatedActivities = filtered.slice(startIndex, startIndex + limit);

    return { activities: paginatedActivities, total };
  }, [allActivities, dateRange, page, limit]);

  // Handlers
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  };

  const handleTypeChange = (newType: ActivityType | "all") => {
    setType(newType);
    setPage(1); // Reset to first page when changing type
  };

  const handleDateRangeChange = (newDateRange: {
    startDate: Date | null;
    endDate: Date | null;
  }) => {
    setDateRange(newDateRange);
    setPage(1); // Reset to first page when changing date range
  };

  return {
    activities: filteredAndPaginatedActivities.activities,
    loading,
    error,
    page,
    limit,
    total: filteredAndPaginatedActivities.total,
    type,
    dateRange,
    handlePageChange,
    handleLimitChange,
    handleTypeChange,
    handleDateRangeChange,
    refreshActivities: fetchActivities,
  };
};
