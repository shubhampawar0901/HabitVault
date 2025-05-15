import { ReactNode } from "react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend = "neutral",
  trendValue,
  loading = false,
}) => {
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

  // Determine trend color and icon
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "bg-green-500/30 text-white";
      case "down":
        return "bg-red-500/30 text-white";
      default:
        return "bg-blue-500/30 text-white";
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return (
          <svg
            className="w-3 h-3 mr-1"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 15L12 9L6 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "down":
        return (
          <svg
            className="w-3 h-3 mr-1"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-3 h-3 mr-1"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 12H19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
    }
  };

  return (
    <motion.div
      className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-blue-100/30 bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-md transition-all duration-300"
      variants={fadeInUp}
      whileHover={{
        y: -5,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        scale: 1.02
      }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium opacity-80">{title}</h3>
          <p className="text-2xl font-bold mt-1">
            {loading ? "..." : value}
          </p>
        </div>
        <div className="mb-1 opacity-70">{icon}</div>
      </div>
      {trendValue && !loading && (
        <motion.div
          className="mt-2 flex items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.2 }}
        >
          <span className={`text-xs px-2 py-0.5 rounded-full flex items-center ${getTrendColor()}`}>
            {getTrendIcon()}
            {trendValue}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default StatCard;
