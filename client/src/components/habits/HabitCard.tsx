import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Circle,
  Flame,
  Trash2,
  Calendar
} from "lucide-react";
import type { Habit } from "../../services/habitService";
import type { ExtendedHabit } from "../../types/habit.types";

// Animation variants
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: -10,
    transition: {
      duration: 0.4,
      ease: "easeInOut"
    }
  }
};

export interface HabitCardProps {
  habit: Habit | ExtendedHabit;
  onToggleCompletion: (id: number) => void;
  isCompletedToday: boolean;
  isMissedToday: boolean;
  isCheckingLoading?: boolean;
  onDelete?: (id: number) => void;
  showActions?: boolean;
  showStats?: boolean;
}

const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onToggleCompletion,
  isCompletedToday,
  isMissedToday,
  isCheckingLoading = false,
  onDelete,
  showActions = true,
  showStats = true
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!onDelete) return;

    if (showDeleteConfirm) {
      setIsDeleting(true);
      // We'll delay the actual deletion to allow the animation to play
      setTimeout(() => {
        onDelete(habit.id);
      }, 300); // Slightly shorter than the animation duration to ensure smooth transition
    } else {
      setShowDeleteConfirm(true);
    }
  };

  // Cancel delete confirmation
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleToggleCompletion = () => {
    if (!isToggling && !isCheckingLoading) {
      setIsToggling(true);
      onToggleCompletion(habit.id);
      setTimeout(() => {
        setIsToggling(false);
      }, 500); // Add a small delay to prevent rapid clicking
    }
  };

  // Calculate actual completion percentage based on habit data
  // For habits with ExtendedHabit interface that might have completion_rate property
  const completionPercentage = 'completion_rate' in habit && typeof habit.completion_rate === 'number'
    ? habit.completion_rate
    : isCompletedToday
      ? 100 // If completed today and it's a new habit, show 100%
      : habit.current_streak > 0
        ? Math.round((habit.current_streak / (habit.current_streak + 1)) * 100)
        : 0;

  // Get border color based on status
  const getBorderColor = () => {
    if (isCompletedToday) return "border-green-100 dark:border-green-800";
    if (isMissedToday) return "border-red-100 dark:border-red-800";
    return "border-blue-100 dark:border-gray-700";
  };

  // Get status button styling
  const getStatusButtonStyle = () => {
    if (isCompletedToday) {
      return "bg-green-100 dark:bg-green-800/50 text-green-600 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800";
    }
    if (isMissedToday) {
      return "bg-red-100 dark:bg-red-800/50 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800";
    }
    // Not marked (default)
    return "bg-blue-100 dark:bg-blue-800/50 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800";
  };

  // Get status button text
  const getStatusButtonText = () => {
    if (isCompletedToday) {
      return (
        <>
          <CheckCircle size={16} className="mr-1" />
          <span className="text-xs font-medium">Completed</span>
        </>
      );
    }
    if (isMissedToday) {
      return (
        <>
          <Circle size={16} className="mr-1 text-red-500" />
          <span className="text-xs font-medium">Missed</span>
        </>
      );
    }
    return (
      <>
        <Circle size={16} className="mr-1" />
        <span className="text-xs font-medium">Not Marked</span>
      </>
    );
  };

  // Get action button text
  const getActionButtonText = () => {
    if (isCompletedToday) {
      return "Mark Missed";
    }
    if (isMissedToday) {
      return "Reset Status";
    }
    return "Mark Complete";
  };

  // Get action button style
  const getActionButtonStyle = () => {
    if (isCompletedToday) {
      return "bg-red-500 hover:bg-red-600";
    }
    if (isMissedToday) {
      return "bg-blue-500 hover:bg-blue-600";
    }
    return "bg-green-500 hover:bg-green-600";
  };

  return (
    <motion.div
      variants={itemVariants}
      layout
      initial="hidden"
      animate={isDeleting ? "exit" : "visible"}
      exit="exit"
      className={`bg-white dark:bg-gray-800 rounded-xl border ${getBorderColor()} p-5 shadow-sm hover:shadow-md transition-all duration-300 ${
        isDeleting ? "pointer-events-none opacity-80 border-red-200 bg-red-50 dark:bg-red-900/20" : ""
      }`}
      whileHover={{ y: -5 }}
    >
      {isDeleting && (
        <div className="absolute inset-0 bg-red-50/30 backdrop-blur-[1px] rounded-xl flex items-center justify-center z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-medium text-red-500 bg-white/80 px-2 py-1 rounded-full shadow-sm"
          >
            Deleting...
          </motion.div>
        </div>
      )}

      {/* Status indicator */}
      <div className="flex items-center mb-3">
        <button
          onClick={handleToggleCompletion}
          disabled={isToggling || isCheckingLoading}
          className={`flex items-center justify-center px-2 py-1 rounded-md transition-all duration-300 ${
            isToggling ? "animate-pulse" : ""
          } ${getStatusButtonStyle()}`}
          aria-label={
            isCompletedToday
              ? "Habit completed - click to mark as missed"
              : isMissedToday
              ? "Habit missed - click to clear status"
              : "Habit not marked - click to mark as completed"
          }
          title={
            isCompletedToday
              ? "Completed - click to change"
              : isMissedToday
              ? "Missed - click to change"
              : "Not marked - click to change"
          }
        >
          <span className="flex items-center">
            {getStatusButtonText()}
          </span>
        </button>
      </div>

      {/* Habit name row - full width */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-2">
        <h3
          className="font-bold text-gray-900 dark:text-white text-xl truncate flex-1"
          title={habit.name}
        >
          {habit.name}
        </h3>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {showActions && onDelete && (
            <>
              {showDeleteConfirm ? (
                <div className="flex space-x-1">
                  <button
                    onClick={handleCancelDelete}
                    className="p-1.5 rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Cancel"
                  >
                    ✕
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-1.5 rounded-full text-red-400 dark:text-red-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Confirm delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleDelete}
                  className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Delete habit"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </>
          )}

          <Link
            to={`/habits/${habit.id}`}
            className="px-3 py-1.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-md border border-gray-200 dark:border-gray-600 shadow-md hover:shadow-lg transition-all text-sm"
          >
            Details
          </Link>
        </div>
      </div>

      {/* Streak and Frequency */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3 sm:gap-0">
        {/* Left-aligned Current Streak */}
        <div className="flex items-center">
          <Flame size={20} className="text-orange-600 mr-2" style={{ strokeWidth: 2.5 }} />
          <div>
            <div className="text-xs text-gray-700 dark:text-gray-400 font-medium">Current streak</div>
            <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{habit.current_streak} days</div>
          </div>
        </div>

        {/* Right-aligned Frequency */}
        <div className="flex items-center">
          <Calendar size={18} className="text-blue-500 mr-2 sm:hidden" />
          <div className="sm:text-right">
            <div className="text-xs text-gray-700 dark:text-gray-400 font-medium">Frequency</div>
            <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {habit.target_type === "daily"
                ? "Daily"
                : habit.target_type === "weekdays"
                ? "Weekdays"
                : "Custom"}
            </div>
          </div>
          <Calendar size={18} className="text-blue-500 ml-2 hidden sm:block" />
        </div>
      </div>

      {/* Stats */}
      {showStats && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 text-sm text-gray-800 dark:text-gray-300 gap-2 sm:gap-0">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-blue-500 mr-2 sm:hidden"></div>
              <span>Completion: <span className="font-bold text-gray-900 dark:text-white">{completionPercentage}%</span></span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2 sm:hidden"></div>
              <span>Best streak: <span className="font-bold text-gray-900 dark:text-white">{habit.longest_streak} days</span></span>
            </div>
          </div>

          <button
            onClick={handleToggleCompletion}
            disabled={isToggling || isCheckingLoading}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors flex items-center justify-center ${
              isToggling ? "opacity-70" : ""
            } ${getActionButtonStyle()}`}
            style={{ touchAction: "manipulation" }} /* Improves touch experience */
          >
            {isToggling ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            ) : null}
            {getActionButtonText()}
          </button>
        </>
      )}
    </motion.div>
  );
};

export default HabitCard;
