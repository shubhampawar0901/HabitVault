import { useState } from "react";
import { Calendar } from "lucide-react";

interface DateRangeSelectorProps {
  startDate: Date;
  endDate: Date;
  onChange: (startDate: Date, endDate: Date) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  startDate,
  endDate,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Predefined date ranges
  const dateRanges = [
    {
      label: "Last 7 days",
      getRange: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 7);
        return { start, end };
      },
    },
    {
      label: "Last 30 days",
      getRange: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 30);
        return { start, end };
      },
    },
    {
      label: "This month",
      getRange: () => {
        const end = new Date();
        const start = new Date(end.getFullYear(), end.getMonth(), 1);
        return { start, end };
      },
    },
    {
      label: "Last month",
      getRange: () => {
        const end = new Date();
        end.setDate(0); // Last day of previous month
        const start = new Date(end.getFullYear(), end.getMonth(), 1);
        return { start, end };
      },
    },
    {
      label: "This year",
      getRange: () => {
        const end = new Date();
        const start = new Date(end.getFullYear(), 0, 1);
        return { start, end };
      },
    },
  ];

  // Handle predefined range selection
  const handleRangeSelect = (range: { start: Date; end: Date }) => {
    onChange(range.start, range.end);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        className="px-4 py-2 bg-white dark:bg-gray-800 border border-blue-200 dark:border-gray-700 rounded-lg shadow-sm flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Calendar size={16} className="mr-2" />
        <span>
          {formatDate(startDate)} - {formatDate(endDate)}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-blue-100 dark:border-gray-700 z-10">
          <div className="p-2">
            {dateRanges.map((range, index) => (
              <button
                key={index}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                onClick={() => handleRangeSelect(range.getRange())}
              >
                {range.label}
              </button>
            ))}
          </div>
          <div className="border-t border-blue-100 dark:border-gray-700 p-2">
            <button
              className="w-full text-center px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeSelector;
