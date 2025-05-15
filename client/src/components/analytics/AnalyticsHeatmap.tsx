import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, TrendingUp, BarChart2, PieChart } from "lucide-react";
import type { HeatmapData } from "../../services/analyticsService";
import { useLocalHeatmapData } from "../../hooks/useLocalHeatmapData";

interface AnalyticsHeatmapProps {
  data: HeatmapData | null;
  loading?: boolean;
  startDate: Date;
  endDate: Date;
  period?: "daily" | "weekly" | "monthly" | "yearly";
  onDateRangeChange?: (startDate: Date, endDate: Date) => void;
}

interface CalendarDay {
  date: Date;
  status: "completed" | "missed" | "skipped" | "none";
  count: number;
}

const AnalyticsHeatmap: React.FC<AnalyticsHeatmapProps> = ({
  data,
  loading = false,
  startDate,
  // endDate is not used but kept in props for API consistency
  period,
  onDateRangeChange,
}) => {
  // Use our custom hook for local heatmap data management
  const {
    localData,
    isLoading,
    // error is not used but kept for debugging purposes
    currentMonth,
    currentYear,
    navigateToPrevMonth,
    navigateToNextMonth
  } = useLocalHeatmapData(
    data,
    startDate.getMonth(),
    startDate.getFullYear(),
    period
  );

  // State for calendar days
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);

  // State for animation direction
  const [animationDirection, setAnimationDirection] = useState<"left" | "right">("right");

  // Generate calendar days from the local heatmap data
  const generateCalendarDays = useCallback(() => {
    if (!localData) return [];

    const days: CalendarDay[] = [];
    // firstDayOfMonth is defined but not used directly - it's used for date calculations
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    // Create a day for each day in the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateStr = date.toISOString().split("T")[0];

      // Count completed, missed, and skipped habits for this day
      let completedCount = 0;
      let missedCount = 0;
      let skippedCount = 0;

      Object.values(localData).forEach((habit) => {
        const status = habit.checkins[dateStr];
        if (status === "completed") completedCount++;
        else if (status === "missed") missedCount++;
        else if (status === "skipped") skippedCount++;
      });

      // Determine the overall status for the day
      let status: "completed" | "missed" | "skipped" | "none" = "none";
      let count = 0;

      if (completedCount > 0) {
        status = "completed";
        count = completedCount;
      } else if (missedCount > 0) {
        status = "missed";
        count = missedCount;
      } else if (skippedCount > 0) {
        status = "skipped";
        count = skippedCount;
      }

      days.push({
        date,
        status,
        count,
      });
    }

    return days;
  }, [localData, currentMonth, currentYear]);

  // Update calendar days when local data changes
  useEffect(() => {
    if (localData) {
      const days = generateCalendarDays();
      setCalendarDays(days);
    }
  }, [localData, generateCalendarDays]);

  // Generate sample calendar days when no data is available
  const generateSampleCalendarDays = useCallback(() => {
    const days: CalendarDay[] = [];
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Create a day for each day in the month with random statuses
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);

      // Generate random status
      const rand = Math.random();
      let status: "completed" | "missed" | "skipped" | "none";
      let count = 0;

      if (rand < 0.6) {
        status = "completed";
        count = Math.floor(Math.random() * 3) + 1;
      } else if (rand < 0.8) {
        status = "missed";
        count = Math.floor(Math.random() * 2) + 1;
      } else if (rand < 0.9) {
        status = "skipped";
        count = 1;
      } else {
        status = "none";
      }

      days.push({
        date,
        status,
        count,
      });
    }

    return days;
  }, [currentMonth, currentYear]);

  // Use sample data if no real data is available
  useEffect(() => {
    if (!localData && !isLoading) {
      const sampleDays = generateSampleCalendarDays();
      setCalendarDays(sampleDays);
    }
  }, [localData, isLoading, generateSampleCalendarDays]);

  // Handle month navigation with animation direction
  const handlePrevMonth = () => {
    setAnimationDirection("left");
    navigateToPrevMonth();

    // Update parent component's date range if callback is provided
    if (onDateRangeChange) {
      const firstDayOfPrevMonth = new Date(
        currentMonth === 0 ? currentYear - 1 : currentYear,
        currentMonth === 0 ? 11 : currentMonth - 1,
        1
      );
      const lastDayOfPrevMonth = new Date(
        currentMonth === 0 ? currentYear - 1 : currentYear,
        currentMonth === 0 ? 12 : currentMonth,
        0
      );
      onDateRangeChange(firstDayOfPrevMonth, lastDayOfPrevMonth);
    }
  };

  const handleNextMonth = () => {
    setAnimationDirection("right");
    navigateToNextMonth();

    // Update parent component's date range if callback is provided
    if (onDateRangeChange) {
      const firstDayOfNextMonth = new Date(
        currentMonth === 11 ? currentYear + 1 : currentYear,
        currentMonth === 11 ? 0 : currentMonth + 1,
        1
      );
      const lastDayOfNextMonth = new Date(
        currentMonth === 11 ? currentYear + 1 : currentYear,
        currentMonth === 11 ? 1 : currentMonth + 2,
        0
      );
      onDateRangeChange(firstDayOfNextMonth, lastDayOfNextMonth);
    }
  };

  // Get dark mode state
  const isDarkMode = document.documentElement.classList.contains('dark');

  // Get color based on status and count
  const getColorClass = (status: string, count: number) => {
    switch (status) {
      case "completed":
        if (count >= 3) return isDarkMode ? "bg-green-700" : "bg-green-600";
        if (count === 2) return isDarkMode ? "bg-green-600" : "bg-green-500";
        return isDarkMode ? "bg-green-500" : "bg-green-400";
      case "missed":
        if (count >= 2) return isDarkMode ? "bg-red-600" : "bg-red-500";
        return isDarkMode ? "bg-red-500" : "bg-red-400";
      case "skipped":
        return isDarkMode ? "bg-gray-500" : "bg-gray-400";
      default:
        return isDarkMode ? "bg-gray-700" : "bg-gray-100";
    }
  };

  // Get the day of week headers
  const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // Create an array of empty cells for days before the first day of the month
  const emptyCells = Array(firstDayOfMonth).fill(null);

  // Array of inspirational quotes related to habit tracking and analytics
  const quotes = useMemo(() => [
    {
      text: "What gets measured gets managed.",
      author: "Peter Drucker"
    },
    {
      text: "Small habits make big results.",
      author: "Anonymous"
    },
    {
      text: "Data is the new oil. It's valuable, but if unrefined it cannot really be used.",
      author: "Clive Humby"
    },
    {
      text: "The chains of habit are too light to be felt until they are too heavy to be broken.",
      author: "Warren Buffett"
    },
    {
      text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
      author: "Aristotle"
    }
  ], []);

  // Select a random quote - memoize to prevent changing during re-renders
  const randomQuote = useMemo(() =>
    quotes[Math.floor(Math.random() * quotes.length)],
  [quotes]);

  // Animation variants for the calendar
  const calendarVariants = {
    enter: (direction: string) => ({
      x: direction === "right" ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: string) => ({
      x: direction === "right" ? -100 : 100,
      opacity: 0,
    }),
  };

  // If initial loading and no data, show loading state
  if (loading && !localData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-blue-500">Loading heatmap data...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full max-w-full">
      {/* Heatmap Section - Fixed width to match Streak History chart */}
      <div className="flex flex-col md:w-1/2 w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">
            {new Date(currentYear, currentMonth).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevMonth}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors disabled:opacity-50"
              disabled={isLoading}
              aria-label="Previous month"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors disabled:opacity-50"
              disabled={isLoading}
              aria-label="Next month"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Calendar container with AnimatePresence for smooth transitions */}
        <AnimatePresence initial={false} mode="wait" custom={animationDirection}>
          <motion.div
            key={`${currentMonth}-${currentYear}`}
            custom={animationDirection}
            variants={calendarVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="w-full"
          >
            <div className="grid grid-cols-7 gap-2 justify-start">
              {/* Day headers - always visible */}
              {dayHeaders.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-bold text-gray-600 dark:text-gray-400 py-1"
                >
                  {day}
                </div>
              ))}

              {/* Empty cells for days before the first day of the month - always visible */}
              {emptyCells.map((_, index) => (
                <div key={`empty-${index}`} className="h-9"></div>
              ))}

              {/* Calendar days with staggered animations */}
              {isLoading ? (
                /* Show loading placeholders for days when loading */
                Array(new Date(currentYear, currentMonth + 1, 0).getDate()).fill(null).map((_, index) => (
                  <motion.div
                    key={`loading-day-${index}`}
                    className="relative h-9 flex items-center justify-center"
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 0.7 }}
                    transition={{
                      repeat: Infinity,
                      repeatType: "reverse",
                      duration: 0.5
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm font-medium"
                    >
                      {index + 1}
                    </div>
                  </motion.div>
                ))
              ) : (
                /* Show actual calendar days when data is loaded */
                calendarDays.map((day, index) => (
                  <motion.div
                    key={`day-${index}`}
                    className="relative h-9 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: index * 0.01,
                      duration: 0.2,
                      type: "spring",
                      stiffness: 500
                    }}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        getColorClass(day.status, day.count)
                      } text-white text-sm font-medium`}
                      title={`${day.date.toLocaleDateString()}: ${day.count} ${day.status}`}
                    >
                      {day.date.getDate()}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-start mt-4 gap-3">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-green-500 dark:bg-green-600 mr-2"></div>
            <span className="text-xs text-gray-600 dark:text-gray-300">Completed</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-red-500 dark:bg-red-600 mr-2"></div>
            <span className="text-xs text-gray-600 dark:text-gray-300">Missed</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-gray-400 dark:bg-gray-500 mr-2"></div>
            <span className="text-xs text-gray-600 dark:text-gray-300">Skipped</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-gray-100 dark:bg-gray-700 mr-2"></div>
            <span className="text-xs text-gray-600 dark:text-gray-300">No Data</span>
          </div>
        </div>
      </div>

      {/* Inspirational Quote Section - Enhanced styling */}
      <motion.div
        className="md:w-1/2 w-full bg-gradient-to-br from-blue-600 to-sky-400 rounded-lg p-6 flex flex-col justify-center items-center shadow-md"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        key="quote-section" // Add key to prevent re-rendering
      >
        <div className="mb-4">
          {/* Use a consistent icon based on the quote to prevent flickering */}
          {randomQuote.author === "Peter Drucker" ? (
            <BarChart2 className="text-white h-12 w-12 opacity-80" />
          ) : randomQuote.author === "Warren Buffett" ? (
            <TrendingUp className="text-white h-12 w-12 opacity-80" />
          ) : (
            <PieChart className="text-white h-12 w-12 opacity-80" />
          )}
        </div>
        <blockquote className="text-center">
          <p className="text-xl font-bold text-white mb-3 italic">"{randomQuote.text}"</p>
          <footer className="text-sm text-white text-opacity-90 font-medium">— {randomQuote.author}</footer>
        </blockquote>
        <div className="mt-6 text-sm text-white font-bold">
          Track your habits. Transform your life.
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsHeatmap;
