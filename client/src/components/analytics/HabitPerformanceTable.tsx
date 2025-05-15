import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flame, Award } from "lucide-react";
import type { AnalyticsSummary } from "../../services/analyticsService";

interface HabitPerformanceTableProps {
  topStreaks?: AnalyticsSummary["top_streaks"];
  loading?: boolean;
  period?: "daily" | "weekly" | "monthly" | "yearly";
}

const HabitPerformanceTable: React.FC<HabitPerformanceTableProps> = ({
  topStreaks,
  loading = false,
  period,
}) => {
  const [habits, setHabits] = useState<any[]>([]);

  useEffect(() => {
    if (topStreaks && topStreaks.length > 0) {
      // Sort by current streak (descending)
      const sortedHabits = [...topStreaks].sort((a, b) => b.current_streak - a.current_streak);
      setHabits(sortedHabits);
    } else {
      // Sample data if no streaks are provided
      setHabits([
        { id: 1, name: "Morning Run", current_streak: 5, longest_streak: 12 },
        { id: 2, name: "Read Book", current_streak: 3, longest_streak: 8 },
        { id: 3, name: "Meditate", current_streak: 7, longest_streak: 15 },
        { id: 4, name: "Drink Water", current_streak: 10, longest_streak: 20 },
        { id: 5, name: "Journal", current_streak: 2, longest_streak: 6 },
      ]);
    }
  }, [topStreaks, period]); // Add period as a dependency to refresh when it changes

  // Animation variants
  const tableRowVariants = {
    initial: { opacity: 0, y: 20 },
    animate: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.3,
      },
    }),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-blue-500">Loading habit data...</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-blue-100 dark:divide-gray-700">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Habit
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Current Streak
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Longest Streak
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-blue-50 dark:divide-gray-700">
          {habits.map((habit, index) => (
            <motion.tr
              key={habit.id}
              custom={index}
              variants={tableRowVariants}
              initial="initial"
              animate="animate"
              className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
            >
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">{habit.name}</div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                  <Flame className="text-orange-500 mr-2" size={16} />
                  <span className="text-sm text-gray-900 dark:text-gray-200 font-medium">{habit.current_streak} days</span>
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                  <Award className="text-blue-500 mr-2" size={16} />
                  <span className="text-sm text-gray-900 dark:text-gray-200">{habit.longest_streak} days</span>
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {habit.current_streak > 0 ? (
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-800/50 text-green-800 dark:text-green-300">
                    Active
                  </span>
                ) : (
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                    Inactive
                  </span>
                )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HabitPerformanceTable;
