"use client"

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart2,
  Calendar,
  TrendingUp,
  PieChart,
  Filter,
  Download,
  ChevronDown,
} from "lucide-react";
import AppLayout from "../../components/layout/AppLayout";
import { useAnalyticsSummary } from "../../hooks/useAnalyticsSummary";
import { useAnalyticsHeatmap } from "../../hooks/useAnalyticsHeatmap";
import StatCard from "../../components/analytics/StatCard";
import ChartCard from "../../components/analytics/ChartCard";
import CompletionRateChart from "../../components/analytics/CompletionRateChart";
import HabitTypeDistribution from "../../components/analytics/HabitTypeDistribution";
import StreakHistoryChart from "../../components/analytics/StreakHistoryChart";
import HabitPerformanceTable from "../../components/analytics/HabitPerformanceTable";
import AnalyticsHeatmap from "../../components/analytics/AnalyticsHeatmap";
import DateRangeSelector from "../../components/analytics/DateRangeSelector";
import { showToast } from "../../components/common/Toast";
import {
  getDateRangeFromLocalStorage,
  saveDateRangeToLocalStorage,
  getPeriodFromLocalStorage,
  savePeriodToLocalStorage
} from "../../utils/localStorage";

// Animation variants - fadeInUp is defined but not used directly
// It's kept for reference and potential future use

const staggerContainer = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const AnalyticsPage = () => {
  // Default date range values (first day of current month to today)
  const defaultStartDate = new Date(new Date().setDate(1));
  const defaultEndDate = new Date();
  const defaultPeriod = "weekly" as const;

  // State for date range and period selection - initialize from localStorage or defaults
  const [dateRange, setDateRange] = useState(() =>
    getDateRangeFromLocalStorage(defaultStartDate, defaultEndDate)
  );

  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly">(() =>
    getPeriodFromLocalStorage(defaultPeriod)
  );

  // Log initial values loaded from localStorage (for debugging)
  useEffect(() => {
    console.log("Analytics page initialized with:", {
      dateRange,
      period,
      fromLocalStorage: true
    });
  }, []);

  // Format date strings for API calls
  const startDateStr = dateRange.startDate.toISOString().split("T")[0];
  const endDateStr = dateRange.endDate.toISOString().split("T")[0];

  // Fetch analytics data with date range and period
  const { summary, summaryLoading } = useAnalyticsSummary(
    startDateStr,
    endDateStr,
    period
  );
  const { heatmapData, heatmapLoading } = useAnalyticsHeatmap(
    startDateStr,
    endDateStr,
    period
  );

  // Handle date range change
  const handleDateRangeChange = (startDate: Date, endDate: Date) => {
    // Update state
    setDateRange({ startDate, endDate });

    // Save to localStorage
    saveDateRangeToLocalStorage(startDate, endDate);
  };

  // Handle period change
  const handlePeriodChange = (newPeriod: "daily" | "weekly" | "monthly" | "yearly") => {
    // Update state
    setPeriod(newPeriod);

    // Save to localStorage
    savePeriodToLocalStorage(newPeriod);
  };

  // Handle export data to CSV
  const handleExportData = () => {
    if (summaryLoading || !summary) {
      showToast.error("Please wait for data to load before exporting.");
      return;
    }

    try {
      // Create CSV content
      let csvContent = "";

      // Add headers
      csvContent += "Category,Value\n";

      // Add summary data
      csvContent += `Completion Rate,${Math.round(summary.completion_rate || 0)}%\n`;
      csvContent += `Active Streaks,${summary.top_streaks?.filter(s => s.current_streak > 0).length || 0}\n`;
      csvContent += `Longest Streak,${summary.longest_streak || 0} days\n`;
      csvContent += `Total Habits,${summary.total_habits || 0}\n\n`;

      // Add habit types
      csvContent += "Habit Types,Count\n";
      if (summary.habit_types) {
        if (summary.habit_types.daily) csvContent += `Daily,${summary.habit_types.daily}\n`;
        if (summary.habit_types.weekdays) csvContent += `Weekdays,${summary.habit_types.weekdays}\n`;
        if (summary.habit_types.custom) csvContent += `Custom,${summary.habit_types.custom}\n`;
      }
      csvContent += "\n";

      // Add top streaks
      csvContent += "Habit,Current Streak,Longest Streak,Status\n";
      if (summary.top_streaks && summary.top_streaks.length > 0) {
        summary.top_streaks.forEach(streak => {
          csvContent += `${streak.name},${streak.current_streak},${streak.longest_streak},${streak.current_streak > 0 ? 'Active' : 'Inactive'}\n`;
        });
      }

      // Create a Blob instead of a data URI (more efficient for larger files)
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

      // Create object URL from Blob
      const url = window.URL.createObjectURL(blob);

      // Create download link
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `habit-analytics-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);

      // Trigger download
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url); // Important: release the object URL to free memory

      // Show success message
      showToast.success("CSV file exported successfully");
    } catch (error) {
      console.error("Error exporting CSV:", error);
      showToast.error("Failed to export CSV file");
    }
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
          <motion.h1
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Analytics Dashboard
          </motion.h1>

          <motion.div
            className="flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <DateRangeSelector
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              onChange={handleDateRangeChange}
            />

            <div className="relative">
              <button
                onClick={() => {
                  // Toggle dropdown menu
                  const dropdown = document.getElementById('period-dropdown');
                  if (dropdown) {
                    dropdown.classList.toggle('hidden');
                  }
                }}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-blue-200 dark:border-gray-700 rounded-lg shadow-sm flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Filter size={16} className="mr-2" />
                {period.charAt(0).toUpperCase() + period.slice(1)}
                <ChevronDown size={16} className="ml-2" />
              </button>

              {/* Period dropdown menu */}
              <div
                id="period-dropdown"
                className="absolute top-full left-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-blue-100 dark:border-gray-700 z-10 hidden"
              >
                <div className="p-2">
                  {['daily', 'weekly', 'monthly', 'yearly'].map((p) => (
                    <button
                      key={p}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                        period === p
                          ? 'bg-blue-100 dark:bg-blue-800/50 text-blue-700 dark:text-blue-300 font-medium'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => {
                        handlePeriodChange(p as "daily" | "weekly" | "monthly" | "yearly");
                        document.getElementById('period-dropdown')?.classList.add('hidden');
                      }}
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleExportData}
              className={`px-4 py-2 rounded-lg shadow-sm flex items-center text-sm font-medium transition-colors ${
                summaryLoading || !summary
                  ? 'bg-blue-300 dark:bg-blue-700 cursor-not-allowed text-white/80 dark:text-white/60'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
              disabled={summaryLoading || !summary}
              title={summaryLoading || !summary ? "Please wait for data to load" : "Export analytics data as CSV"}
            >
              <Download size={16} className="mr-2" />
              Export
            </button>
          </motion.div>
        </div>

        {/* Summary Statistics Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <StatCard
            title="Completion Rate"
            value={summaryLoading ? "..." : `${Math.round(summary?.completion_rate || 0)}%`}
            icon={<BarChart2 size={20} />}
            trend="up"
            trendValue="+5% from last month"
            loading={summaryLoading}
          />
          <StatCard
            title="Active Streaks"
            value={summaryLoading ? "..." : summary?.top_streaks?.filter(s => s.current_streak > 0).length || 0}
            icon={<TrendingUp size={20} />}
            trend="up"
            trendValue="+2 from last month"
            loading={summaryLoading}
          />
          <StatCard
            title="Longest Streak"
            value={summaryLoading ? "..." : `${summary?.longest_streak || 0} days`}
            icon={<Calendar size={20} />}
            trend="up"
            trendValue="+3 days from last month"
            loading={summaryLoading}
          />
          <StatCard
            title="Total Habits"
            value={summaryLoading ? "..." : summary?.total_habits || 0}
            icon={<PieChart size={20} />}
            trend="up"
            trendValue="+1 from last month"
            loading={summaryLoading}
          />
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartCard title="Completion Rate">
            <CompletionRateChart
              period={period}
              loading={summaryLoading}
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              completionRate={summary?.completion_rate}
            />
          </ChartCard>

          <ChartCard title="Habit Type Distribution">
            <HabitTypeDistribution
              habitTypes={summary?.habit_types}
              loading={summaryLoading}
              period={period}
            />
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartCard title="Streak History">
            <StreakHistoryChart
              topStreaks={summary?.top_streaks}
              loading={summaryLoading}
              period={period}
            />
          </ChartCard>

          <ChartCard title="Top Performing Habits">
            <HabitPerformanceTable
              topStreaks={summary?.top_streaks}
              loading={summaryLoading}
              period={period}
            />
          </ChartCard>
        </div>

        {/* Heatmap Section */}
        <ChartCard title="Habit Completion Heatmap">
          <AnalyticsHeatmap
            data={heatmapData}
            loading={heatmapLoading}
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            period={period}
            onDateRangeChange={handleDateRangeChange}
          />
        </ChartCard>
      </div>
    </AppLayout>
  );
};

export default AnalyticsPage;
