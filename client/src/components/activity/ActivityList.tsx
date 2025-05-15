import { motion } from "framer-motion";
import {
  Check,
  Award,
  Calendar,
  Clock,
  Edit,
  Trash,
  AlertCircle
} from "lucide-react";
import { type Activity, type ActivityType, formatRelativeTime } from "../../services/activityService";

interface ActivityListProps {
  activities: Activity[];
  onActivityClick?: (activity: Activity) => void;
}

const ActivityList: React.FC<ActivityListProps> = ({
  activities,
  onActivityClick
}) => {
  // Group activities by day
  const groupActivitiesByDay = (activities: Activity[]) => {
    const groups: { [key: string]: Activity[] } = {};

    activities.forEach(activity => {
      const date = new Date(activity.timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let groupKey: string;

      if (date.toDateString() === today.toDateString()) {
        groupKey = "Today";
      } else if (date.toDateString() === yesterday.toDateString()) {
        groupKey = "Yesterday";
      } else {
        groupKey = date.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric'
        });
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }

      groups[groupKey].push(activity);
    });

    return groups;
  };

  const activityGroups = groupActivitiesByDay(activities);

  // Activity icon mapping
  const activityIcons: Record<ActivityType, React.ElementType> = {
    habit_completed: Check,
    streak_milestone: Award,
    habit_created: Calendar,
    habit_updated: Edit,
    habit_deleted: Trash,
    reminder: Clock
  };

  // Activity color mapping
  const activityColors: Record<ActivityType, string> = {
    habit_completed: "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-800/50",
    streak_milestone: "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-800/50",
    habit_created: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-800/50",
    habit_updated: "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-800/50",
    habit_deleted: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-800/50",
    reminder: "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700"
  };

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle size={40} className="text-blue-300 dark:text-blue-400 mb-3" />
        <p className="text-gray-500 dark:text-gray-400 mb-2">No activities found</p>
        <p className="text-sm text-gray-400 dark:text-gray-500">Complete habits or create new ones to see your activity here</p>
      </div>
    );
  }

  return (
    <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
      {Object.entries(activityGroups).map(([date, dateActivities]) => (
        <div key={date} className="space-y-4">
          {/* Date header */}
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider pt-2 pb-1 border-b border-gray-100 dark:border-gray-700">
            {date}
          </h3>

          {dateActivities.map((activity) => {
            const IconComponent = activityIcons[activity.type] || AlertCircle;
            const colorClass = activityColors[activity.type] || "text-gray-600 bg-gray-100";

            return (
              <motion.div
                key={activity.id}
                className={`flex items-start pb-4 border-b border-blue-50 dark:border-gray-700 last:border-0 last:pb-0 ${
                  onActivityClick ? 'cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg p-2 -m-2 transition-colors' : ''
                }`}
                variants={fadeInUp}
                whileHover={{ x: onActivityClick ? 5 : 0 }}
                onClick={() => onActivityClick && onActivityClick(activity)}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${colorClass}`}>
                  <IconComponent size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">{activity.title}</p>
                  <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">{activity.description}</p>

                  {/* Show streak count for streak milestones */}
                  {activity.type === 'streak_milestone' && activity.streakCount && (
                    <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 dark:bg-purple-800/50 text-purple-800 dark:text-purple-300">
                      <Award size={12} className="mr-1" />
                      {activity.streakCount} day streak
                    </div>
                  )}

                  {/* Show related habit name if available */}
                  {activity.relatedName && (
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {activity.relatedName}
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full whitespace-nowrap">
                  {formatRelativeTime(activity.timestamp)}
                </span>
              </motion.div>
            );
          })}
        </div>
      ))}
    </motion.div>
  );
};

export default ActivityList;
