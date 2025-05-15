import { useState, useEffect, useCallback } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface CompletionRateChartProps {
  period: "daily" | "weekly" | "monthly" | "yearly";
  loading?: boolean;
  startDate?: Date;
  endDate?: Date;
  completionRate?: number;
}


const CompletionRateChart: React.FC<CompletionRateChartProps> = ({
  period,
  loading = false,
}) => {
  // Sample data - in a real app, this would come from the API
  const [data, setData] = useState<unknown[]>([]);

  // Custom formatter for x-axis labels to prevent overlapping
  const formatXAxisTick = useCallback((value: string) => {
    // For daily view, simplify the format to just the day number when possible
    if (period === "daily") {
      const parts = value.split(" ");
      if (parts.length === 2) {
        // Return just the day number for most labels to save space
        return parts[1];
      }
    }
    return value;
  }, [period]);

  useEffect(() => {
    // Generate sample data based on the selected period
    const generateData = () => {
      const result = [];
      const now = new Date();

      switch (period) {
        case "daily":
          // Last 14 days
          for (let i = 13; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            // Format date consistently to ensure proper spacing
            const month = date.toLocaleDateString("en-US", { month: "short" });
            const day = date.getDate();
            result.push({
              name: `${month} ${day}`,
              completionRate: Math.floor(Math.random() * 40) + 60, // Random between 60-100
              fullDate: date.toISOString(), // Store full date for tooltip
            });
          }
          break;
        case "weekly":
          // Last 12 weeks
          for (let i = 11; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i * 7);
            result.push({
              name: `Week ${12 - i}`,
              completionRate: Math.floor(Math.random() * 40) + 60,
            });
          }
          break;
        case "monthly":
          // Last 12 months
          for (let i = 11; i >= 0; i--) {
            const date = new Date(now);
            date.setMonth(date.getMonth() - i);
            result.push({
              name: date.toLocaleDateString("en-US", { month: "short" }),
              completionRate: Math.floor(Math.random() * 40) + 60,
            });
          }
          break;
        case "yearly":
          // Last 5 years
          for (let i = 4; i >= 0; i--) {
            const date = new Date(now);
            date.setFullYear(date.getFullYear() - i);
            result.push({
              name: date.getFullYear().toString(),
              completionRate: Math.floor(Math.random() * 40) + 60,
            });
          }
          break;
      }

      return result;
    };

    setData(generateData());
  }, [period]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-blue-500 dark:text-blue-400">Loading chart data...</div>
      </div>
    );
  }

  // Get CSS variables for dark mode support
  const isDarkMode = document.documentElement.classList.contains('dark');
  const gridColor = isDarkMode ? '#374151' : '#f0f0f0';
  const textColor = isDarkMode ? '#9ca3af' : '#666';
  const tickColor = isDarkMode ? '#4b5563' : '#ccc';

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="name"
            tick={{ fill: textColor }}
            tickLine={{ stroke: tickColor }}
            interval="preserveStartEnd"
            tickMargin={5}
            minTickGap={15}
            height={50}
            tickFormatter={formatXAxisTick}
            angle={0}
          />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
            tick={{ fill: textColor }}
            tickLine={{ stroke: tickColor }}
          />
          <Tooltip
            formatter={(value) => [
              <span style={{ color: isDarkMode ? '#e5e7eb' : 'inherit' }}>{`${value}%`}</span>,
              <span style={{ color: isDarkMode ? '#e5e7eb' : 'inherit' }}>Completion Rate</span>
            ]}
            labelFormatter={(label, items) => {
              // If we have the full date in the payload, use it for a more detailed tooltip
              if (items && items[0] && items[0].payload.fullDate) {
                const date = new Date(items[0].payload.fullDate);
                return date.toLocaleDateString("en-US", {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                });
              }
              return label;
            }}
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
          <Line
            type="monotone"
            dataKey="completionRate"
            stroke={isDarkMode ? "#6366f1" : "#4f46e5"}
            strokeWidth={2}
            dot={{ r: 4, fill: isDarkMode ? "#6366f1" : "#4f46e5", strokeWidth: 0 }}
            activeDot={{
              r: 6,
              fill: isDarkMode ? "#6366f1" : "#4f46e5",
              stroke: isDarkMode ? "#1f2937" : "white",
              strokeWidth: 2
            }}
            name="Completion Rate"
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CompletionRateChart;
