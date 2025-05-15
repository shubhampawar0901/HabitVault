"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Check,
  Award,
  Calendar,
  Clock,
  ChevronRight,
  Edit,
  Trash,
  AlertCircle,
  Zap
} from "lucide-react"
import { activityService, type Activity, formatRelativeTime } from "../../services/activityService"

// Activity icon mapping
const activityIcons = {
  habit_completed: Check,
  streak_milestone: Award,
  habit_created: Calendar,
  habit_updated: Edit,
  habit_deleted: Trash,
  reminder: Clock
}

// Activity color mapping
const activityColors = {
  habit_completed: "text-green-600 bg-green-100",
  streak_milestone: "text-purple-600 bg-purple-100",
  habit_created: "text-blue-600 bg-blue-100",
  habit_updated: "text-amber-600 bg-amber-100",
  habit_deleted: "text-red-600 bg-red-100",
  reminder: "text-gray-600 bg-gray-100"
}

interface RecentActivityProps {
  limit?: number;
}

const RecentActivity = ({ limit = 5 }: RecentActivityProps) => {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true)
        const data = await activityService.getRecentActivities(limit)
        setActivities(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching activities:", err)
        setError("Failed to load recent activities")
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [limit])

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  // Group activities by day
  const groupActivitiesByDay = (activities: Activity[]) => {
    const groups: { [key: string]: Activity[] } = {}

    activities.forEach(activity => {
      const date = new Date(activity.timestamp)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      let groupKey: string

      if (date.toDateString() === today.toDateString()) {
        groupKey = "Today"
      } else if (date.toDateString() === yesterday.toDateString()) {
        groupKey = "Yesterday"
      } else {
        groupKey = date.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric'
        })
      }

      if (!groups[groupKey]) {
        groups[groupKey] = []
      }

      groups[groupKey].push(activity)
    })

    return groups
  }

  const activityGroups = groupActivitiesByDay(activities)

  // Render empty state
  if (!loading && activities.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl border border-blue-100 dark:border-gray-700 p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
      >
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
            Recent Activity
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle size={40} className="text-blue-300 mb-3" />
          <p className="text-gray-500 mb-2">No recent activity found</p>
          <p className="text-sm text-gray-400">Complete habits or create new ones to see your activity here</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-blue-100 dark:border-gray-700 p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
          Recent Activity
        </h2>
        <button className="text-blue-500 text-xs sm:text-sm font-medium hover:text-blue-700 transition-colors flex items-center">
          View all
          <ChevronRight size={16} className="ml-1" />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-pulse text-blue-500">Loading activity data...</div>
        </div>
      ) : error ? (
        <div className="flex justify-center py-8 text-red-500">
          <AlertCircle size={18} className="mr-2" />
          {error}
        </div>
      ) : (
        <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
          {Object.entries(activityGroups).map(([date, dateActivities]) => (
            <div key={date} className="space-y-4">
              {/* Date header for groups other than Today */}
              {date !== "Today" && (
                <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider pt-2 pb-1 border-b border-gray-100 dark:border-gray-700">
                  {date}
                </h3>
              )}

              {dateActivities.map((activity) => {
                const IconComponent = activityIcons[activity.type] || AlertCircle
                const colorClass = activityColors[activity.type] || "text-gray-600 bg-gray-100"

                return (
                  <motion.div
                    key={activity.id}
                    className="flex items-start pb-4 border-b border-blue-50 dark:border-gray-700 last:border-0 last:pb-0"
                    variants={fadeInUp}
                    whileHover={{ x: 5 }}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${colorClass}`}>
                      <IconComponent size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{activity.title}</p>
                      <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">{activity.description}</p>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                      {formatRelativeTime(activity.timestamp)}
                    </span>
                  </motion.div>
                )
              })}
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}

export default RecentActivity
