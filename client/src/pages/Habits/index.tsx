import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Filter,
  SortDesc,
  Grid,
  List
} from "lucide-react";
import { useHabits } from "../../hooks/useHabits";
import { useTheme } from "../../hooks/useThemeContext";
import EmptyState from "../../components/common/EmptyState";

import AppLayout from "../../components/layout/AppLayout";
import HabitCard from "../../components/habits/HabitCard";

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

// Using the reusable HabitCard component from ../../components/habits/HabitCard

// Using the reusable EmptyState component from ../../components/common/EmptyState

const HabitsPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const {
    filteredHabits,
    loading,
    error,
    searchTerm,
    sortBy,
    filterBy,
    viewMode,
    checkinsLoading,
    setSearchTerm,
    setFilterBy,
    setSortBy,
    setViewMode,
    deleteHabit,
    toggleHabitCompletion,
    isHabitCompletedToday,
    isHabitMissedToday
  } = useHabits();

  const [showFilters, setShowFilters] = useState(false);

  const handleDeleteHabit = async (id: number) => {
    try {
      // Add a small delay to ensure the animation has time to complete
      await deleteHabit(id);
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  };

  const handleToggleCompletion = (id: number) => {
    toggleHabitCompletion(id);
  };

  if (loading && filteredHabits.length === 0) {
    return (
      <AppLayout>
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-baseline">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">Habits</h1>
              <span className="ml-3 text-xl font-bold text-blue-600">Daily Check-ins & Tracking</span>
            </div>
          </div>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-xl h-24 opacity-60`}></div>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-baseline">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">Habits</h1>
              <span className="ml-3 text-xl font-bold text-blue-600">Daily Check-ins & Tracking</span>
            </div>
          </div>
          <div className={`${isDarkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-800'} p-4 rounded-lg`}>
            <p>Error loading habits: {error}</p>
            <button
              className={`mt-2 text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'} underline`}
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-baseline">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">Habits</h1>
            <span className="ml-3 text-xl font-bold text-blue-600">Daily Check-ins & Tracking</span>
          </div>
          <Link
            to="/habits/new"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors sm:self-end"
          >
            <Plus size={18} className="mr-2" />
            Add Habit
          </Link>
        </div>

      {/* Search and filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Search input */}
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search habits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full py-2 pl-10 pr-4 rounded-lg border ${
                isDarkMode
                  ? 'border-blue-900/30 focus:ring-blue-500 bg-gray-800/80 text-gray-200'
                  : 'border-blue-100 focus:ring-blue-400 bg-white/80 text-gray-800'
              } focus:outline-none focus:ring-2 focus:border-transparent text-sm transition-all duration-300 hover:shadow-md`}
            />
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-blue-400' : 'text-blue-400'}`} size={16} />
          </div>

          {/* Filter and sort buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-3 py-2 ${
                isDarkMode
                  ? 'bg-gray-800 border-blue-900/30 text-blue-400 hover:bg-gray-700'
                  : 'bg-white border-blue-100 text-blue-600 hover:bg-blue-50'
              } border font-medium rounded-lg transition-colors`}
            >
              <Filter size={16} className="mr-2" />
              Filter
            </button>

            <button
              onClick={() => setSortBy(sortBy === "name" ? "created" : "name")}
              className={`inline-flex items-center px-3 py-2 ${
                isDarkMode
                  ? 'bg-gray-800 border-blue-900/30 text-blue-400 hover:bg-gray-700'
                  : 'bg-white border-blue-100 text-blue-600 hover:bg-blue-50'
              } border font-medium rounded-lg transition-colors`}
            >
              <SortDesc size={16} className="mr-2" />
              {sortBy === "name" ? "Sort by Name" :
               sortBy === "streak" ? "Sort by Streak" :
               sortBy === "updated" ? "Sort by Updated" : "Sort by Created"}
            </button>

            <div className={`flex rounded-lg overflow-hidden border ${isDarkMode ? 'border-blue-900/30' : 'border-blue-100'}`}>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${
                  viewMode === "grid"
                    ? "bg-blue-500 text-white"
                    : isDarkMode
                      ? "bg-gray-800 text-blue-400 hover:bg-gray-700"
                      : "bg-white text-blue-600 hover:bg-blue-50"
                } transition-colors`}
                title="Grid view"
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${
                  viewMode === "list"
                    ? "bg-blue-500 text-white"
                    : isDarkMode
                      ? "bg-gray-800 text-blue-400 hover:bg-gray-700"
                      : "bg-white text-blue-600 hover:bg-blue-50"
                } transition-colors`}
                title="List view"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Filter options */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`${isDarkMode ? 'bg-gray-800 border-blue-900/30' : 'bg-white border-blue-100'} p-4 rounded-lg border shadow-sm`}
          >
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterBy("all")}
                className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                  filterBy === "all"
                    ? "bg-blue-500 text-white"
                    : isDarkMode
                      ? "bg-blue-900/30 text-blue-400 hover:bg-blue-800/40"
                      : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                } transition-colors`}
              >
                All
              </button>
              <button
                onClick={() => setFilterBy("daily")}
                className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                  filterBy === "daily"
                    ? "bg-blue-500 text-white"
                    : isDarkMode
                      ? "bg-blue-900/30 text-blue-400 hover:bg-blue-800/40"
                      : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                } transition-colors`}
              >
                Daily
              </button>
              <button
                onClick={() => setFilterBy("weekdays")}
                className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                  filterBy === "weekdays"
                    ? "bg-blue-500 text-white"
                    : isDarkMode
                      ? "bg-blue-900/30 text-blue-400 hover:bg-blue-800/40"
                      : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                } transition-colors`}
              >
                Weekdays
              </button>
              <button
                onClick={() => setFilterBy("custom")}
                className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                  filterBy === "custom"
                    ? "bg-blue-500 text-white"
                    : isDarkMode
                      ? "bg-blue-900/30 text-blue-400 hover:bg-blue-800/40"
                      : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                } transition-colors`}
              >
                Custom
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Habits grid/list */}
      {filteredHabits.length === 0 ? (
        <EmptyState
          type="habits"
          actionText="Add Your First Habit"
          actionLink="/habits/new"
          title={searchTerm ? `No habits found matching "${searchTerm}"` : "No habits found"}
          description={searchTerm
            ? "Try adjusting your search or filter criteria"
            : "Regular habits help build lasting change. Add your first habit to get started!"}
        />
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            : "space-y-4"
          }
        >
          <AnimatePresence mode="popLayout">
            {filteredHabits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onDelete={handleDeleteHabit}
                onToggleCompletion={handleToggleCompletion}
                isCompletedToday={isHabitCompletedToday(habit.id)}
                isMissedToday={isHabitMissedToday(habit.id)}
                isCheckingLoading={checkinsLoading}
                showActions={true}
                showStats={true}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
      </div>
    </AppLayout>
  );
};

export default HabitsPage;
