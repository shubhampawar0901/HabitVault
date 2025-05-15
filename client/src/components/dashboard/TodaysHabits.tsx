import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  ArrowRight
} from "lucide-react";
import { useTodaysHabits } from "../../hooks/useTodaysHabits";
import type { Habit } from "../../services/habitService";
import { groupHabitsByTimeOfDay } from "../../utils/habitUtils";
import EmptyState from "../common/EmptyState";
import HabitCard from "../habits/HabitCard";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};


// Using the reusable HabitCard component from ../habits/HabitCard

interface SectionProps {
  title: string;
  habits: Habit[];
  onToggle: (habitId: number) => void;
  isHabitCompletedToday: (habitId: number) => boolean;
  isHabitMissedToday: (habitId: number) => boolean;
}

const HabitSection: React.FC<SectionProps> = ({
  title,
  habits,
  onToggle,
  isHabitCompletedToday,
  isHabitMissedToday
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (habits.length === 0) return null;

  return (
    <div className="mb-6">
      <div
        className="flex items-center justify-between mb-3 cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3 className="text-sm font-medium text-blue-500 dark:text-blue-400 uppercase tracking-wider flex items-center">
          {title}
          <span className="ml-2 bg-blue-100 dark:bg-blue-800/50 text-blue-800 dark:text-blue-300 text-xs font-medium px-2 py-0.5 rounded-full">
            {habits.length}
          </span>
        </h3>
        <button className="text-blue-500 dark:text-blue-400 p-1 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-colors">
          {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {habits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                isCompletedToday={isHabitCompletedToday(habit.id)}
                isMissedToday={isHabitMissedToday(habit.id)}
                onToggleCompletion={onToggle}
                showStats={false}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

// EmptyState component is now imported from ../common/EmptyState

const TodaysHabits: React.FC = () => {
  const {
    todaysHabits,
    completedHabits,
    incompleteHabits,
    loading,
    error,
    toggleHabitCompletion,
    isHabitCompletedToday,
    isHabitMissedToday
  } = useTodaysHabits();

  const [showCompleted, setShowCompleted] = useState(true);

  // Group habits by time of day
  const groupedHabits = groupHabitsByTimeOfDay(incompleteHabits);

  if (loading) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold dark:text-white">Today's Habits</h2>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-gray-700 rounded-xl h-24 opacity-60"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-800 dark:text-red-300">
        <p>Error loading habits: {error}</p>
        <button
          className="mt-2 text-sm text-red-600 dark:text-red-400 underline"
          onClick={() => window.location.reload()}
        >
          Try again
        </button>
      </div>
    );
  }

  if (todaysHabits.length === 0) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold dark:text-white">Today's Habits</h2>
          <Link
            to="/habits/new"
            className="inline-flex items-center px-3 py-1.5 bg-blue-100 dark:bg-blue-800/50 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
          >
            <Plus size={16} className="mr-1" />
            New Habit
          </Link>
        </div>
        <EmptyState
          type="checkins"
          actionText="Add New Habit"
          actionLink="/habits/new"
        />
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold dark:text-white">Today's Habits</h2>
        <div className="flex items-center space-x-4">
          <label className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={() => setShowCompleted(!showCompleted)}
              className="mr-2 h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            Show completed
          </label>
          <Link
            to="/habits"
            className="inline-flex items-center px-3 py-1.5 bg-blue-100 dark:bg-blue-800/50 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
          >
            <ArrowRight size={16} className="mr-1" />
            View All Habits
          </Link>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Morning habits */}
        <HabitSection
          title="Morning"
          habits={groupedHabits["Morning"]}
          onToggle={toggleHabitCompletion}
          isHabitCompletedToday={isHabitCompletedToday}
          isHabitMissedToday={isHabitMissedToday}
        />

        {/* Afternoon habits */}
        <HabitSection
          title="Afternoon"
          habits={groupedHabits["Afternoon"]}
          onToggle={toggleHabitCompletion}
          isHabitCompletedToday={isHabitCompletedToday}
          isHabitMissedToday={isHabitMissedToday}
        />

        {/* Evening habits */}
        <HabitSection
          title="Evening"
          habits={groupedHabits["Evening"]}
          onToggle={toggleHabitCompletion}
          isHabitCompletedToday={isHabitCompletedToday}
          isHabitMissedToday={isHabitMissedToday}
        />

        {/* Completed habits */}
        {showCompleted && completedHabits.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-green-500 dark:text-green-400 uppercase tracking-wider flex items-center">
                Completed
                <span className="ml-2 bg-green-100 dark:bg-green-800/50 text-green-800 dark:text-green-300 text-xs font-medium px-2 py-0.5 rounded-full">
                  {completedHabits.length}
                </span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {completedHabits.map(habit => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    isCompletedToday={true}
                    isMissedToday={false}
                    onToggleCompletion={toggleHabitCompletion}
                    showStats={false}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TodaysHabits;
