import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layers, Award, Check } from "lucide-react";
import { useDashboardData } from "../../hooks/useDashboardData";
import { useTheme } from "../../hooks/useThemeContext";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
};

const staggerContainer = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: string;
  trendValue?: string;
  loading: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  loading,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <motion.div
      className={`${isDarkMode ? 'bg-gray-800/20' : 'bg-white/20'} backdrop-blur-md rounded-xl p-4 border ${isDarkMode ? 'border-blue-900/30' : 'border-blue-100/30'} bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-md transition-all duration-300`}
      variants={fadeInUp}
      whileHover={{
        y: -5,
        backgroundColor: isDarkMode ? "rgba(30, 41, 59, 0.3)" : "rgba(255, 255, 255, 0.3)",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        scale: 1.02
      }}
      whileTap={{ scale: 0.98 }}
    >
      <p className="text-sm font-medium opacity-80">{title}</p>
      <div className="flex items-end justify-between">
        {loading ? (
          <div className="animate-pulse mt-1">
            <div className="h-8 w-16 bg-white/30 rounded"></div>
          </div>
        ) : (
          <p className="text-3xl font-bold mt-1">{value}</p>
        )}
        <div className="mb-1 opacity-70">{icon}</div>
      </div>
      {trendValue && !loading && (
        <motion.div
          className="mt-2 flex items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.2 }}
        >
          <span className={`text-xs px-2 py-0.5 rounded-full flex items-center ${
            trend === "up"
              ? "bg-green-500/30 text-white"
              : "bg-red-500/30 text-white"
          }`}>
            {trend === "up" ? (
              <svg
                className="w-3 h-3 mr-1"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 5L19 12L12 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5 12H19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                className="w-3 h-3 mr-1"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 19L5 12L12 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19 12H5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {trendValue}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

const StatsSummaryCards: React.FC = () => {
  // We don't need isDarkMode here as it's handled by the theme context
  // const { isDarkMode } = useTheme();
  const dashboardData = useDashboardData();
  const [trends, setTrends] = useState({
    totalHabits: { direction: "up", value: "+0" },
    activeStreaks: { direction: "up", value: "+0" },
    completedToday: { direction: "up", value: "+0" },
  });

  // Simulate trend data (in a real app, this would come from the API)
  useEffect(() => {
    // This is just for demonstration - in a real app, you'd fetch this data from the API
    setTrends({
      totalHabits: { direction: "up", value: "+2" },
      activeStreaks: { direction: "up", value: "+1" },
      completedToday: { direction: "up", value: "+2 today" },
    });
  }, []);

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8 relative"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      layout
    >
      <StatCard
        title="Total Habits"
        value={dashboardData.totalHabits}
        icon={<Layers size={20} />}
        trend={trends.totalHabits.direction}
        trendValue={trends.totalHabits.value}
        loading={dashboardData.loading}
      />
      <StatCard
        title="Active Streaks"
        value={dashboardData.activeStreaks}
        icon={<Award size={20} />}
        trend={trends.activeStreaks.direction}
        trendValue={trends.activeStreaks.value}
        loading={dashboardData.loading}
      />
      <StatCard
        title="Completed Today"
        value={dashboardData.completedToday}
        icon={<Check size={20} />}
        trend={trends.completedToday.direction}
        trendValue={trends.completedToday.value}
        loading={dashboardData.loading}
      />
    </motion.div>
  );
};

export default StatsSummaryCards;
