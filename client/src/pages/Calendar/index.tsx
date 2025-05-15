import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AppLayout from "../../components/layout/AppLayout";
import { habitService, type Habit, type HabitCheckin } from "../../services/habitService";
import { showToast } from "../../components/common/Toast";
import { useTheme } from "../../hooks/useThemeContext";

interface CalendarDay {
  day: number;
  date: Date;
  checkins: {
    habitId: number;
    habitName: string;
    status: "completed" | "missed" | "skipped";
  }[];
  isToday: boolean;
}

const CalendarPage = () => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [allCheckins, setAllCheckins] = useState<Record<number, HabitCheckin[]>>({});
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [hoveredDay, setHoveredDay] = useState<CalendarDay | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Get current date info
  const today = new Date();
  const currentDay = today.getDate();
  const currentRealMonth = today.getMonth();
  const currentRealYear = today.getFullYear();

  // Fetch habits and checkins
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all habits
        const habitsData = await habitService.getAllHabits();
        setHabits(habitsData);

        // Calculate date range for the current month
        const endDate = new Date(currentYear, currentMonth + 1, 0);

        const startDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`;
        const lastDay = endDate.getDate();
        const endDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

        // Fetch checkins for each habit
        const checkinsMap: Record<number, HabitCheckin[]> = {};

        for (const habit of habitsData) {
          try {
            const habitCheckins = await habitService.getCheckins(
              habit.id,
              startDateStr,
              endDateStr
            );
            checkinsMap[habit.id] = habitCheckins;
          } catch (error) {
            console.error(`Error fetching checkins for habit ${habit.id}:`, error);
            checkinsMap[habit.id] = [];
          }
        }

        setAllCheckins(checkinsMap);
      } catch (error) {
        console.error("Error fetching calendar data:", error);
        showToast.error("Failed to load calendar data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentMonth, currentYear]);

  // Handle navigation
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Generate calendar days
  const generateCalendarDays = (): CalendarDay[] => {
    const days: CalendarDay[] = [];

    try {
      // Get calendar data
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

      console.log("Calendar data:", {
        currentYear,
        currentMonth,
        daysInMonth,
        firstDayOfMonth,
        habitsCount: habits.length,
        checkinsCount: Object.values(allCheckins).flat().length
      });

      // Add empty cells for days before the first day of the month
      for (let i = 0; i < firstDayOfMonth; i++) {
        const prevMonthDate = new Date(currentYear, currentMonth, -i);
        days.unshift({
          day: prevMonthDate.getDate(),
          date: prevMonthDate,
          checkins: [],
          isToday: false
        });
      }
    } catch (error) {
      console.error("Error generating calendar days:", error);
      // Return an empty array if there's an error
      return [];
    }

    try {
      // Add days of the month
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        const isToday = day === currentDay && currentMonth === currentRealMonth && currentYear === currentRealYear;

        // Format date as YYYY-MM-DD for comparison with API data
        const year = currentYear;
        const month = String(currentMonth + 1).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        const dateStr = `${year}-${month}-${dayStr}`;

        // Find checkins for this day across all habits
        const dayCheckins: CalendarDay['checkins'] = [];

        habits.forEach(habit => {
          try {
            const habitCheckins = allCheckins[habit.id] || [];
            const checkin = habitCheckins.find(c => c.date === dateStr);

            if (checkin) {
              dayCheckins.push({
                habitId: habit.id,
                habitName: habit.name,
                status: checkin.status as "completed" | "missed" | "skipped"
              });
            }
          } catch (error) {
            console.error(`Error processing checkins for habit ${habit.id}:`, error);
          }
        });

        days.push({
          day,
          date,
          checkins: dayCheckins,
          isToday
        });
      }

      // Add days from next month to complete the grid
      const totalDaysNeeded = 42; // 6 rows of 7 days
      const remainingDays = totalDaysNeeded - days.length;

      for (let i = 1; i <= remainingDays; i++) {
        const nextMonthDate = new Date(currentYear, currentMonth + 1, i);
        days.push({
          day: i,
          date: nextMonthDate,
          checkins: [],
          isToday: false
        });
      }
    } catch (error) {
      console.error("Error generating calendar days:", error);
      // If we have some days already, return them, otherwise return an empty array
      if (days.length === 0) {
        // Create a basic calendar with just the current month
        const daysInMonth = 30; // Fallback to 30 days
        for (let day = 1; day <= daysInMonth; day++) {
          days.push({
            day,
            date: new Date(currentYear, currentMonth, day),
            checkins: [],
            isToday: day === currentDay && currentMonth === currentRealMonth && currentYear === currentRealYear
          });
        }
      }
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  // Get weeks for week view
  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  // Handle day hover for tooltip
  const handleDayHover = (day: CalendarDay, event: React.MouseEvent) => {
    setHoveredDay(day);
    setShowTooltip(true);

    // Calculate tooltip position
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
  };

  // Format date for tooltip
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6">
        <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">Calendar</h1>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-md w-full" style={{
          height: 'calc(85vh - 180px)',
          minHeight: '500px',
          maxHeight: '700px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400"></div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200" style={{ minWidth: '180px' }}>
                  {new Date(currentYear, currentMonth).toLocaleString("default", {
                    month: "long",
                    year: "numeric"
                  })}
                </h3>

                {/* View mode toggle */}
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-1 flex" style={{ minWidth: '140px' }}>
                    <button
                      onClick={() => setViewMode('month')}
                      className={`w-[60px] py-1 rounded-md text-sm font-bold transition-colors ${
                        viewMode === 'month'
                          ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
                      }`}
                    >
                      Month
                    </button>
                    <button
                      onClick={() => setViewMode('week')}
                      className={`w-[60px] py-1 rounded-md text-sm font-bold transition-colors ${
                        viewMode === 'week'
                          ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
                      }`}
                    >
                      Week
                    </button>
                  </div>

                  {/* Navigation controls */}
                  <div className="flex items-center space-x-2" style={{ minWidth: '70px' }}>
                    <button
                      onClick={handlePrevMonth}
                      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors w-8 h-8 flex items-center justify-center"
                      aria-label="Previous"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={handleNextMonth}
                      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors w-8 h-8 flex items-center justify-center"
                      aria-label="Next"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="relative flex-grow flex flex-col">
                <AnimatePresence mode="sync" initial={false}>
                  <motion.div
                    key={`${currentYear}-${currentMonth}-${viewMode}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="w-full absolute top-0 left-0 h-full flex flex-col"
                  >
                    {/* Day headers */}
                    <div className="grid grid-cols-7 gap-1 text-center mx-auto w-full" style={{ maxWidth: '90%' }}>
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div key={day} className="py-1 text-sm font-bold text-gray-700 dark:text-gray-300">
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar days */}
                    <div className="grid grid-cols-7 grid-rows-6 gap-1 mt-2 mx-auto flex-grow w-full h-full" style={{ maxWidth: '90%' }}>
                      {viewMode === 'month' ? (
                        // Month view - show all days
                        calendarDays.map((day, index) => (
                          <CalendarDayCell
                            key={index}
                            day={day}
                            currentMonth={currentMonth}
                            onHover={handleDayHover}
                            onLeave={() => setShowTooltip(false)}
                          />
                        ))
                      ) : (
                        // Week view - show only current week
                        (() => {
                          // Find the index of the current day
                          const currentDayIndex = calendarDays.findIndex(day =>
                            day.day === currentDay &&
                            day.date.getMonth() === currentMonth &&
                            day.date.getFullYear() === currentYear
                          );

                          // If current day is found, show that week, otherwise show first week
                          const weekIndex = currentDayIndex !== -1
                            ? Math.floor(currentDayIndex / 7)
                            : 0;

                          // Make sure the week exists
                          if (weeks.length > 0 && weeks[weekIndex]) {
                            return weeks[weekIndex].map((day, index) => (
                              <CalendarDayCell
                                key={index}
                                day={day}
                                currentMonth={currentMonth}
                                onHover={handleDayHover}
                                onLeave={() => setShowTooltip(false)}
                              />
                            ));
                          }

                          // Fallback to first week if something goes wrong
                          return weeks[0]?.map((day, index) => (
                            <CalendarDayCell
                              key={index}
                              day={day}
                              currentMonth={currentMonth}
                              onHover={handleDayHover}
                              onLeave={() => setShowTooltip(false)}
                            />
                          )) || null;
                        })()
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Tooltip */}
              {showTooltip && hoveredDay && (
                <div
                  className="fixed bg-white dark:bg-gray-800 p-2 rounded-md shadow-md text-xs z-50 border border-gray-200 dark:border-gray-700"
                  style={{
                    left: `${tooltipPosition.x}px`,
                    top: `${tooltipPosition.y}px`,
                    transform: 'translate(-50%, -100%)',
                    pointerEvents: 'none',
                    minWidth: '150px'
                  }}
                >
                  <div className="font-bold text-gray-800 dark:text-gray-200 mb-1">{formatDate(hoveredDay.date)}</div>
                  {hoveredDay.checkins.length > 0 ? (
                    <div className="space-y-1">
                      {hoveredDay.checkins.map((checkin, index) => (
                        <div key={index} className="flex items-center">
                          <div
                            className={`w-2 h-2 rounded-full mr-1 ${
                              checkin.status === 'completed' ? 'bg-green-500 dark:bg-green-400' :
                              checkin.status === 'missed' ? 'bg-red-500 dark:bg-red-400' : 'bg-gray-400 dark:bg-gray-500'
                            }`}
                          />
                          <span className="text-gray-700 dark:text-gray-300 truncate" style={{ maxWidth: '120px' }}>
                            {checkin.habitName}: {checkin.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 dark:text-gray-400">No habits tracked</div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

// Calendar Day Cell Component
interface CalendarDayCellProps {
  day: CalendarDay;
  currentMonth: number;
  onHover: (day: CalendarDay, event: React.MouseEvent) => void;
  onLeave: () => void;
}

const CalendarDayCell: React.FC<CalendarDayCellProps> = ({
  day,
  currentMonth,
  onHover,
  onLeave
}) => {
  // Variables to be used in the render
  let isCurrentMonth = false;
  let bgColorClass = "bg-gray-100 dark:bg-gray-700";
  let completedCount = 0;
  let missedCount = 0;
  let skippedCount = 0;
  let totalCount = 0;

  try {
    // Safety check for day object
    if (!day || !day.date) {
      console.error("Invalid day object:", day);
      return null;
    }

    isCurrentMonth = day.date.getMonth() === currentMonth;

    // Calculate completion stats
    completedCount = day.checkins?.filter(c => c.status === 'completed').length || 0;
    missedCount = day.checkins?.filter(c => c.status === 'missed').length || 0;
    skippedCount = day.checkins?.filter(c => c.status === 'skipped').length || 0;
    totalCount = day.checkins?.length || 0;

    // Determine cell background color based on completion ratio
    if (totalCount > 0) {
      const completionRatio = completedCount / totalCount;

      if (completionRatio === 1) {
        bgColorClass = "bg-green-500 dark:bg-green-600 text-white"; // All completed
      } else if (completionRatio >= 0.5) {
        bgColorClass = "bg-green-300 dark:bg-green-700 text-gray-800 dark:text-gray-200"; // Mostly completed
      } else if (completedCount > 0) {
        bgColorClass = "bg-green-200 dark:bg-green-800/50 text-gray-800 dark:text-gray-200"; // Some completed
      } else if (missedCount > 0) {
        bgColorClass = "bg-red-200 dark:bg-red-800/50 text-gray-800 dark:text-gray-200"; // Some missed
      }
    }
  } catch (error) {
    console.error("Error in CalendarDayCell:", error);
    return null;
  }

  return (
    <div
      className="flex items-center justify-center p-1 h-full"
      onMouseEnter={(e) => onHover(day, e)}
      onMouseLeave={onLeave}
    >
      <div
        className={`
          rounded-md flex flex-col items-center justify-center relative w-full h-full
          ${day.isToday ? 'ring-1 ring-blue-400' : ''}
          ${!isCurrentMonth ? 'opacity-40' : ''}
          ${bgColorClass}
          transition-all duration-200
        `}
        style={{ minHeight: '45px', minWidth: '45px', aspectRatio: '1/1' }}
      >
        <span className={`text-sm font-bold ${totalCount > 0 ? '' : 'text-gray-500 dark:text-gray-400'}`}>
          {day.day}
        </span>

        {totalCount > 0 && (
          <div className="flex space-x-1 mt-1">
            {completedCount > 0 && (
              <div className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-green-400" />
            )}
            {missedCount > 0 && (
              <div className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-400" />
            )}
            {skippedCount > 0 && (
              <div className="w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-gray-400" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
