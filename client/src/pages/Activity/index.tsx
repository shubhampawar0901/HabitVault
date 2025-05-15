import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { type Activity } from "../../services/activityService";
import AppLayout from "../../components/layout/AppLayout";
import ActivityFilter from "../../components/activity/ActivityFilter";
import ActivityList from "../../components/activity/ActivityList";
import ActivityPagination from "../../components/activity/ActivityPagination";
import { useActivities } from "../../hooks/useActivities";

const ActivityPage = () => {
  const [, setSelectedActivity] = useState<Activity | null>(null);

  // Use our custom hook for activity data and state management
  const {
    activities,
    loading,
    error,
    page,
    limit,
    total,
    type,
    dateRange,
    handlePageChange,
    handleLimitChange,
    handleTypeChange,
    handleDateRangeChange
  } = useActivities({
    initialLimit: 10,
    initialPage: 1
  });

  // Handle activity click
  const handleActivityClick = (activity: Activity) => {
    setSelectedActivity(activity);
    // In a future enhancement, we could show a modal with more details
    // or navigate to the related habit

    // For now, just log the activity
    console.log("Activity clicked:", activity);

    // If the activity has a related habit, we could navigate to it
    if (activity.relatedId) {
      // For future implementation:
      // navigate(`/habits/${activity.relatedId}`);
    }
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">Activity</h1>
        </div>

        {/* Activity Filter */}
        <div className="mb-6">
          <ActivityFilter
            activeFilter={type}
            onFilterChange={handleTypeChange}
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
          />
        </div>

        {/* Activity content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-md">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-pulse text-blue-500">Loading activity data...</div>
            </div>
          ) : error ? (
            <div className="flex justify-center py-8 text-red-500">
              <AlertCircle size={18} className="mr-2" />
              {error}
            </div>
          ) : (
            <>
              {/* Activity List */}
              <ActivityList
                activities={activities}
                onActivityClick={handleActivityClick}
              />

              {/* Pagination */}
              {total > 0 && (
                <ActivityPagination
                  currentPage={page}
                  totalItems={total}
                  itemsPerPage={limit}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleLimitChange}
                />
              )}
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default ActivityPage;
