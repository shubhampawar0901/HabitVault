import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { HabitCheckin } from "../../services/habitService";
import { useTheme } from "../../hooks/useThemeContext";

interface CalendarDay {
  day: number;
  date: Date;
  status: "completed" | "missed" | "skipped" | null;
  checkinId?: number;
  isToday: boolean;
  isScheduled: boolean;
}

interface HabitCalendarProps {
  habitId: number;
  targetType: "daily" | "weekdays" | "custom";
  targetDays?: string[];
  checkins: HabitCheckin[];
  onMonthChange: (year: number, month: number) => void;
  currentYear: number;
  currentMonth: number;
  startDate: string; // Add start date prop
}

const HabitCalendar: React.FC<HabitCalendarProps> = ({
  targetType,
  targetDays,
  checkins,
  onMonthChange,
  currentYear,
  currentMonth,
  startDate
}) => {
  const { isDarkMode } = useTheme();
  const [hoveredDay, setHoveredDay] = useState<CalendarDay | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  // Get current date info
  const today = new Date();
  const currentDay = today.getDate();
  const currentRealMonth = today.getMonth();
  const currentRealYear = today.getFullYear();

  // Handle navigation
  const handlePrevMonth = (e: React.MouseEvent) => {
    // Prevent default behavior and stop propagation
    e.preventDefault();
    e.stopPropagation();

    // Calculate new month/year
    let newMonth = currentMonth;
    let newYear = currentYear;

    if (currentMonth === 0) {
      newMonth = 11;
      newYear = currentYear - 1;
    } else {
      newMonth = currentMonth - 1;
    }

    // Call parent's onMonthChange with new values
    onMonthChange(newYear, newMonth);
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    // Prevent default behavior and stop propagation
    e.preventDefault();
    e.stopPropagation();

    // Calculate new month/year
    let newMonth = currentMonth;
    let newYear = currentYear;

    if (currentMonth === 11) {
      newMonth = 0;
      newYear = currentYear + 1;
    } else {
      newMonth = currentMonth + 1;
    }

    // Call parent's onMonthChange with new values
    onMonthChange(newYear, newMonth);
  };

  // Generate calendar data
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // Check if a date is scheduled based on habit target type
  const isDateScheduled = (date: Date): boolean => {
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const dayMap: Record<number, string> = {
      0: "sun", 1: "mon", 2: "tue", 3: "wed", 4: "thu", 5: "fri", 6: "sat"
    };

    switch (targetType) {
      case "daily":
        return true;
      case "weekdays":
        return dayOfWeek >= 1 && dayOfWeek <= 5;
      case "custom":
        return targetDays?.includes(dayMap[dayOfWeek]) || false;
      default:
        return false;
    }
  };

  // Generate calendar days
  const generateCalendarDays = (): CalendarDay[] => {
    const days: CalendarDay[] = [];

    // Check if checkins array is valid
    if (!checkins || !Array.isArray(checkins)) {
      console.error("Invalid checkins data:", checkins);
      return days;
    }

    // Debug checkins data and habit info
    console.log("Calendar rendering with checkins:", {
      habitStartDate: startDate,
      currentMonth: currentMonth,
      currentYear: currentYear,
      checkins,
      checkinsLength: checkins.length,
      completedCount: checkins.filter(c => c.status === "completed").length,
      missedCount: checkins.filter(c => c.status === "missed").length,
      skippedCount: checkins.filter(c => c.status === "skipped").length,
      allStatuses: checkins.map(c => c.status),
      firstFewCheckins: checkins.slice(0, 3)
    });

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      const prevMonthDate = new Date(currentYear, currentMonth, -i);
      days.unshift({
        day: prevMonthDate.getDate(),
        date: prevMonthDate,
        status: null,
        isToday: false,
        isScheduled: isDateScheduled(prevMonthDate)
      });
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);

      // Format date as YYYY-MM-DD for comparison with API data
      // Need to handle timezone issues by creating a date string manually
      // This ensures we get the correct date regardless of timezone
      const year = currentYear;
      const month = String(currentMonth + 1).padStart(2, '0'); // months are 0-indexed
      const dayStr = String(day).padStart(2, '0');
      const dateStr = `${year}-${month}-${dayStr}`;

      // Debug date string format
      if (day === 1 || day === 15) {
        console.log(`Comparing date string for day ${day}:`, {
          dateStr,
          allCheckinDates: checkins.map(c => c.date),
          dateMatches: checkins.filter(c => c.date === dateStr).length
        });
      }

      // Find matching checkin by comparing dates exactly
      // Try both with and without time component in case there's a format issue
      const checkin = checkins.find(c => {
        // Try exact match first
        if (c.date === dateStr) return true;

        // If that fails, try comparing just the date part
        if (c.date && c.date.includes('T')) {
          const datePart = c.date.split('T')[0];
          return datePart === dateStr;
        }

        return false;
      });

      // Debug specific days
      if (day === 15) {
        console.log(`Checking day ${day}:`, {
          dateStr,
          checkinFound: !!checkin,
          checkinDetails: checkin,
          allDates: checkins.map(c => c.date)
        });
      }

      const isToday = day === currentDay && currentMonth === currentRealMonth && currentYear === currentRealYear;
      const isScheduled = isDateScheduled(date);

      // Determine status based on checkin data
      let status: "completed" | "missed" | "skipped" | null = null;

      if (checkin) {
        // If we have a checkin record, use its status
        status = checkin.status;
        console.log(`Day ${day} has status: ${status} from checkin (id: ${checkin.id})`);
      } else if (isScheduled) {
        // For scheduled days without a checkin
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Parse the habit start date
        const habitStartDate = new Date(startDate);
        habitStartDate.setHours(0, 0, 0, 0);

        // Only mark as missed if the date is:
        // 1. In the past
        // 2. On or after the habit's start date
        if (date < today && date >= habitStartDate) {
          status = "missed";
          console.log(`Day ${day} marked as missed: date=${date.toISOString()}, startDate=${habitStartDate.toISOString()}`);
        }
      }

      // Additional debug for specific days
      if (day === 1 || day === 2 || day === 3) {
        console.log(`Day ${day} final status:`, {
          date: dateStr,
          status,
          checkinFound: !!checkin,
          checkinDetails: checkin,
          isScheduled,
          isPast: date < new Date(),
          isAfterStartDate: date >= new Date(startDate)
        });
      }

      days.push({
        day,
        date,
        status,
        checkinId: checkin?.id,
        isToday,
        isScheduled
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
        status: null,
        isToday: false,
        isScheduled: isDateScheduled(nextMonthDate)
      });
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
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-md w-full" style={{
      height: 'calc(85vh - 180px)',
      minHeight: '500px',
      maxHeight: '700px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
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

            {/* Calendar days in a separate grid for consistent layout */}
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
            pointerEvents: 'none'
          }}
        >
          <div className="font-bold text-gray-800 dark:text-gray-200">{formatDate(hoveredDay.date)}</div>
          <div className="text-gray-700 dark:text-gray-300 font-medium">
            {hoveredDay.status
              ? `Status: ${hoveredDay.status === "skipped"
                  ? "Missed"
                  : hoveredDay.status.charAt(0).toUpperCase() + hoveredDay.status.slice(1)}`
              : hoveredDay.isScheduled
                ? "No data recorded"
                : "Not scheduled"}
          </div>
        </div>
      )}
    </div>
  );
};

// Calendar Day Cell Component
interface CalendarDayCellProps {
  day: CalendarDay;
  currentMonth: number;
  onHover: (day: CalendarDay, event: React.MouseEvent) => void;
  onLeave: () => void;
  isWeekView?: boolean;
}

const CalendarDayCell: React.FC<CalendarDayCellProps> = ({
  day,
  currentMonth,
  onHover,
  onLeave
}) => {
  const isCurrentMonth = day.date.getMonth() === currentMonth;

  // Debug specific days
  if ((day.day === 1 || day.day === 15) && isCurrentMonth) {
    console.log("Rendering day cell:", {
      day: day.day,
      status: day.status,
      isScheduled: day.isScheduled,
      isCurrentMonth,
      checkinId: day.checkinId
    });
  }

  // Determine the background color class based on status
  let bgColorClass = "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"; // default for days with no status

  if (day.status === "completed") {
    // Green for completed days
    bgColorClass = "bg-green-500 dark:bg-green-600 text-white";

    // Debug completed days
    if (isCurrentMonth) {
      console.log(`Day ${day.day} is COMPLETED`);
    }
  } else if (day.status === "missed") {
    // Red for missed days
    bgColorClass = "bg-red-500 dark:bg-red-600 text-white";
  } else if (day.status === "skipped") {
    // For backward compatibility, treat skipped as missed
    // since we're only using completed/missed now
    bgColorClass = "bg-red-500 dark:bg-red-600 text-white";
  } else if (!day.isScheduled) {
    // Lighter gray for days that aren't scheduled
    bgColorClass = "bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500";
  }

  return (
    <div
      className="flex items-center justify-center p-1 h-full"
      onMouseEnter={(e) => onHover(day, e)}
      onMouseLeave={onLeave}
    >
      <div
        className={`
          rounded-md flex items-center justify-center relative w-full h-full
          ${day.isToday ? 'ring-1 ring-blue-400' : ''}
          ${!isCurrentMonth ? 'opacity-40' : ''}
          ${bgColorClass}
          transition-all duration-200
        `}
        style={{ minHeight: '45px', minWidth: '45px', aspectRatio: '1/1' }}
      >
        <span className="text-sm font-bold">
          {day.day}
        </span>
      </div>
    </div>
  );
};

export default HabitCalendar;
