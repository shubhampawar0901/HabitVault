import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

interface HabitTypeDistributionProps {
  habitTypes?: {
    daily?: number;
    weekdays?: number;
    custom?: number;
  };
  loading?: boolean;
  period?: "daily" | "weekly" | "monthly" | "yearly";
}

// Define colors for light and dark mode
const LIGHT_COLORS = ["#4f46e5", "#3b82f6", "#0ea5e9", "#06b6d4"];
const DARK_COLORS = ["#6366f1", "#60a5fa", "#38bdf8", "#22d3ee"];

const HabitTypeDistribution: React.FC<HabitTypeDistributionProps> = ({
  habitTypes,
  loading = false,
  period,
}) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (habitTypes) {
      const result = [];

      if (habitTypes.daily) {
        result.push({
          name: "Daily",
          value: habitTypes.daily,
        });
      }

      if (habitTypes.weekdays) {
        result.push({
          name: "Weekdays",
          value: habitTypes.weekdays,
        });
      }

      if (habitTypes.custom) {
        result.push({
          name: "Custom",
          value: habitTypes.custom,
        });
      }

      setData(result);
    } else {
      // Sample data if no habit types are provided
      setData([
        { name: "Daily", value: 5 },
        { name: "Weekdays", value: 3 },
        { name: "Custom", value: 2 },
      ]);
    }
  }, [habitTypes, period]); // Add period as a dependency to refresh when it changes

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-blue-500">Loading chart data...</div>
      </div>
    );
  }

  // Get dark mode state
  const isDarkMode = document.documentElement.classList.contains('dark');
  const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS;

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            animationDuration={1000}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [value, "Habits"]}
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
              <span style={{ color: isDarkMode ? '#9ca3af' : '#666' }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HabitTypeDistribution;
