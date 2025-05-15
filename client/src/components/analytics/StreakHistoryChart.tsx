import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { AnalyticsSummary } from "../../services/analyticsService";

interface StreakHistoryChartProps {
  topStreaks?: AnalyticsSummary["top_streaks"];
  loading?: boolean;
  period?: "daily" | "weekly" | "monthly" | "yearly";
}

const StreakHistoryChart: React.FC<StreakHistoryChartProps> = ({
  topStreaks,
  loading = false,
  period,
}) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (topStreaks && topStreaks.length > 0) {
      // Transform the top streaks data for the chart
      const chartData = topStreaks.map((streak) => ({
        name: streak.name.length > 12 ? `${streak.name.substring(0, 12)}...` : streak.name,
        currentStreak: streak.current_streak,
        longestStreak: streak.longest_streak,
      }));

      setData(chartData);
    } else {
      // Sample data if no streaks are provided
      setData([
        { name: "Morning Run", currentStreak: 5, longestStreak: 12 },
        { name: "Read Book", currentStreak: 3, longestStreak: 8 },
        { name: "Meditate", currentStreak: 7, longestStreak: 15 },
        { name: "Drink Water", currentStreak: 10, longestStreak: 20 },
        { name: "Journal", currentStreak: 2, longestStreak: 6 },
      ]);
    }
  }, [topStreaks, period]); // Add period as a dependency to refresh when it changes

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-blue-500">Loading chart data...</div>
      </div>
    );
  }

  // Get dark mode state
  const isDarkMode = document.documentElement.classList.contains('dark');
  const gridColor = isDarkMode ? '#374151' : '#f0f0f0';
  const textColor = isDarkMode ? '#9ca3af' : '#666';
  const tickColor = isDarkMode ? '#4b5563' : '#ccc';

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          barSize={20}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="name"
            tick={{ fill: textColor }}
            tickLine={{ stroke: tickColor }}
          />
          <YAxis
            tick={{ fill: textColor }}
            tickLine={{ stroke: tickColor }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDarkMode ? '#1f2937' : 'white',
              border: `1px solid ${isDarkMode ? '#374151' : '#f0f0f0'}`,
              borderRadius: "4px",
              boxShadow: isDarkMode ? "0 2px 5px rgba(0,0,0,0.3)" : "0 2px 5px rgba(0,0,0,0.1)",
              color: isDarkMode ? '#e5e7eb' : 'inherit'
            }}
            itemStyle={{ color: isDarkMode ? '#e5e7eb' : 'inherit' }}
            labelStyle={{ color: isDarkMode ? '#e5e7eb' : 'inherit' }}
          />
          <Legend
            formatter={(value) => (
              <span style={{ color: textColor }}>{value}</span>
            )}
          />
          <Bar
            dataKey="currentStreak"
            name="Current Streak"
            fill={isDarkMode ? "#6366f1" : "#4f46e5"}
            radius={[4, 4, 0, 0]}
            animationDuration={1000}
          />
          <Bar
            dataKey="longestStreak"
            name="Longest Streak"
            fill={isDarkMode ? "#60a5fa" : "#3b82f6"}
            radius={[4, 4, 0, 0]}
            animationDuration={1000}
            animationDelay={300}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StreakHistoryChart;
