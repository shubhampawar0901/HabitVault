import { useState } from "react";
import { motion } from "framer-motion";
import { Filter, Calendar, X } from "lucide-react";
import type { ActivityType } from "../../services/activityService";
import { useTheme } from "../../hooks/useThemeContext";

interface ActivityFilterProps {
  activeFilter: ActivityType | "all";
  onFilterChange: (filter: ActivityType | "all") => void;
  onDateRangeChange: (dateRange: { startDate: Date | null; endDate: Date | null }) => void;
  dateRange: { startDate: Date | null; endDate: Date | null };
}

const ActivityFilter: React.FC<ActivityFilterProps> = ({
  activeFilter,
  onFilterChange,
  onDateRangeChange,
  dateRange
}) => {
  const { isDarkMode } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  // Activity type options
  const filterOptions = [
    { value: "all", label: "All Activities" },
    { value: "habit_completed", label: "Completed Habits" },
    { value: "streak_milestone", label: "Streak Milestones" },
    { value: "habit_created", label: "Created Habits" },
    { value: "habit_updated", label: "Updated Habits" },
    { value: "habit_deleted", label: "Deleted Habits" },
    { value: "reminder", label: "Reminders" }
  ];

  // Helper function to create a date with time set to start of day
  const startOfDay = (date: Date): Date => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  // Helper function to create a date with time set to end of day
  const endOfDay = (date: Date): Date => {
    const newDate = new Date(date);
    newDate.setHours(23, 59, 59, 999);
    return newDate;
  };

  // Predefined date ranges
  const dateRangeOptions = [
    {
      label: "Today",
      getValue: () => {
        const today = new Date();
        return {
          startDate: startOfDay(today),
          endDate: endOfDay(today)
        };
      }
    },
    {
      label: "Yesterday",
      getValue: () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return {
          startDate: startOfDay(yesterday),
          endDate: endOfDay(yesterday)
        };
      }
    },
    {
      label: "Last 7 Days",
      getValue: () => {
        const today = new Date();
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 6); // 7 days including today
        return {
          startDate: startOfDay(lastWeek),
          endDate: endOfDay(today)
        };
      }
    },
    {
      label: "Last 30 Days",
      getValue: () => {
        const today = new Date();
        const lastMonth = new Date();
        lastMonth.setDate(lastMonth.getDate() - 29); // 30 days including today
        return {
          startDate: startOfDay(lastMonth),
          endDate: endOfDay(today)
        };
      }
    },
    {
      label: "This Month",
      getValue: () => {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        return {
          startDate: startOfDay(firstDayOfMonth),
          endDate: endOfDay(today)
        };
      }
    },
    {
      label: "Last Month",
      getValue: () => {
        const today = new Date();
        const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        return {
          startDate: startOfDay(firstDayLastMonth),
          endDate: endOfDay(lastDayLastMonth)
        };
      }
    }
  ];

  // Handle date range selection
  const handleDateRangeSelect = (option: typeof dateRangeOptions[0]) => {
    try {
      const newDateRange = option.getValue();
      console.log("Setting date range:", newDateRange);
      onDateRangeChange(newDateRange);
    } catch (error) {
      console.error("Error setting date range:", error);
    }
  };

  // Clear date range filter
  const clearDateRange = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    console.log("Clearing date range");
    onDateRangeChange({ startDate: null, endDate: null });
  };

  // Format date for display
  const formatDate = (date: Date | null) => {
    if (!date) return "";
    try {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  // Check if date range is active
  const isDateRangeActive = dateRange.startDate !== null && dateRange.endDate !== null;

  // Format date range for display
  const dateRangeDisplay = isDateRangeActive
    ? `${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)}`
    : "All Time";

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border overflow-hidden`}>
      {/* Filter header */}
      <div
        className="flex items-center justify-between p-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <Filter size={16} className="text-blue-500 dark:text-blue-400" />
          <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Filters</span>
        </div>
        <div className="flex items-center space-x-2">
          {isDateRangeActive && (
            <div className={`flex items-center ${isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'} px-2 py-1 rounded-md text-xs`}>
              <Calendar size={12} className="mr-1" />
              {dateRangeDisplay}
              <button
                onClick={clearDateRange}
                className={`ml-1 ${isDarkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-400 hover:text-blue-600'}`}
                aria-label="Clear date range"
              >
                <X size={12} />
              </button>
            </div>
          )}
          <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L9 1" stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Expandable filter content */}
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className={`p-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          {/* Activity type filter */}
          <div className="mb-4">
            <label className={`block text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-2`}>
              Activity Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  className={`px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    activeFilter === option.value
                      ? isDarkMode
                        ? "bg-blue-900/30 text-blue-400 border border-blue-800"
                        : "bg-blue-100 text-blue-700 border border-blue-200"
                      : isDarkMode
                        ? "bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600"
                        : "bg-gray-50 text-gray-600 border border-gray-100 hover:bg-gray-100"
                  }`}
                  onClick={() => onFilterChange(option.value as ActivityType | "all")}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date range filter */}
          <div>
            <label className={`block text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-2`}>
              Date Range
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {dateRangeOptions.map((option, index) => (
                <button
                  key={index}
                  className={`px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    isDateRangeActive && dateRangeDisplay.includes(option.label)
                      ? isDarkMode
                        ? "bg-blue-900/30 text-blue-400 border border-blue-800"
                        : "bg-blue-100 text-blue-700 border border-blue-200"
                      : isDarkMode
                        ? "bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600"
                        : "bg-gray-50 text-gray-600 border border-gray-100 hover:bg-gray-100"
                  }`}
                  onClick={() => handleDateRangeSelect(option)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ActivityFilter;
