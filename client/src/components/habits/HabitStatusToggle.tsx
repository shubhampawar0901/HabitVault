import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, AlertCircle } from 'lucide-react';

export type HabitStatus = 'missed' | 'completed';

interface HabitStatusToggleProps {
  status: HabitStatus;
  onChange: (newStatus: HabitStatus) => void;
  habitId: number;
  habitName: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const HabitStatusToggle: React.FC<HabitStatusToggleProps> = ({
  status,
  onChange,
  habitId,
  habitName,
  disabled = false,
  size = 'medium',
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<HabitStatus | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const confirmationRef = useRef<HTMLDivElement>(null);

  // Close confirmation dialog when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        confirmationRef.current &&
        !confirmationRef.current.contains(event.target as Node)
      ) {
        setShowConfirmation(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Determine sizes based on the size prop
  const getToggleDimensions = () => {
    switch (size) {
      case 'small':
        return {
          width: 'w-24',
          height: 'h-8',
          thumbSize: 'w-7 h-7',
          fontSize: 'text-xs',
          iconSize: 14,
        };
      case 'large':
        return {
          width: 'w-48',
          height: 'h-12',
          thumbSize: 'w-11 h-11',
          fontSize: 'text-base',
          iconSize: 20,
        };
      case 'medium':
      default:
        return {
          width: 'w-36',
          height: 'h-10',
          thumbSize: 'w-9 h-9',
          fontSize: 'text-sm',
          iconSize: 16,
        };
    }
  };

  const { width, height, thumbSize, fontSize, iconSize } = getToggleDimensions();

  // Get the position of the thumb based on status
  const getThumbPosition = () => {
    switch (status) {
      case 'missed':
        return '0%';
      case 'completed':
        return '100%';
      default:
        return '0%';
    }
  };

  // Get the background color based on status
  const getBackgroundColor = () => {
    // Simplified to just a gradient between red and green
    return 'bg-gradient-to-r from-red-500 to-green-500';
  };

  // Get the thumb color based on status
  const getThumbColor = () => {
    switch (status) {
      case 'missed':
        return 'bg-red-500 text-white';
      case 'completed':
        return 'bg-green-500 text-white';
      default:
        return 'bg-red-500 text-white';
    }
  };

  const handleToggleClick = (newStatus: HabitStatus) => {
    if (disabled) return;

    // Only show confirmation if changing from the current status
    if (newStatus !== status) {
      setPendingStatus(newStatus);
      setShowConfirmation(true);
    }
  };

  const confirmStatusChange = () => {
    if (pendingStatus) {
      onChange(pendingStatus);
      setShowConfirmation(false);
      setPendingStatus(null);
    }
  };

  const cancelStatusChange = () => {
    setShowConfirmation(false);
    setPendingStatus(null);
  };

  return (
    <div className="relative">
      {/* Main Toggle */}
      <div
        className={`relative ${width} ${height} rounded-full cursor-pointer ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${getBackgroundColor()} overflow-hidden`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Missed Label */}
        <div
          className={`absolute left-2 top-1/2 transform -translate-y-1/2 ${fontSize} font-medium text-white z-10`}
          onClick={() => handleToggleClick('missed')}
        >
          <X size={iconSize} className="inline mr-1" />
          {size !== 'small' && 'Missed'}
        </div>

        {/* Completed Label */}
        <div
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${fontSize} font-medium text-white z-10`}
          onClick={() => handleToggleClick('completed')}
        >
          {size !== 'small' && 'Done'}
          <Check size={iconSize} className="inline ml-1" />
        </div>

        {/* No middle option in the completed-only approach */}

        {/* Sliding Thumb - Simplified for completed/missed only */}
        <motion.div
          className={`absolute top-0.5 ${thumbSize} rounded-full shadow-md flex items-center justify-center ${getThumbColor()} z-20`}
          animate={{
            left: status === 'missed' ? '0.125rem' :
                  `calc(100% - ${parseInt(thumbSize.split('-')[1]) * 0.25 + 0.125}rem)`,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          {status === 'missed' && <X size={iconSize} />}
          {status === 'completed' && <Check size={iconSize} />}
        </motion.div>
      </div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            ref={confirmationRef}
            className="absolute mt-2 p-3 bg-white rounded-lg shadow-lg border border-gray-200 z-30 w-64"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            <div className="flex items-start mb-2">
              <AlertCircle size={18} className="text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">
                {pendingStatus === 'completed'
                  ? `Mark "${habitName}" as completed?`
                  : `Mark "${habitName}" as missed?`}
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={cancelStatusChange}
                className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusChange}
                className="px-3 py-1 text-xs bg-blue-500 text-white hover:bg-blue-600 rounded-md transition-colors"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HabitStatusToggle;
