import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";

interface WelcomeSectionProps {
  /**
   * The user's name to display in the greeting
   */
  username: string;
  /**
   * Optional className to apply to the component
   */
  className?: string;
}

/**
 * Format the current date as "Weekday, Month Day" (e.g., "Thursday, May 16")
 */
const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  };
  return date.toLocaleDateString('en-US', options);
};

/**
 * Welcome Section component for the dashboard
 * Displays a personalized greeting, today's date, and a motivational message
 */
const WelcomeSection = ({ username, className = "" }: WelcomeSectionProps) => {
  // Get today's date formatted as "Weekday, Month Day" (e.g., "Thursday, May 16")
  const todayFormatted = formatDate(new Date());

  return (
    <motion.div
      className={`mb-6 sm:mb-8 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-gradient-to-r from-blue-500 via-sky-500 to-blue-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg shadow-blue-200/50 relative overflow-hidden"
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-white/10 blur-md" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-white/10 blur-md" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <motion.h2
            className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-0 relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Welcome back, <span className="font-extrabold">{username}</span>!
          </motion.h2>

          <motion.div
            className="flex items-center text-white/90 text-sm sm:text-base font-medium"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <CalendarDays size={18} className="mr-2 opacity-80" />
            <span>Today is <span className="font-semibold">{todayFormatted}</span></span>
          </motion.div>
        </div>

        <motion.p
          className="opacity-90 mb-4 max-w-2xl text-base sm:text-lg relative"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Track your daily habits, build consistency, and achieve your goals one day at a time.
          Your journey to better habits starts with small, consistent steps.
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeSection;
