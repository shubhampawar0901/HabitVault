"use client"

import { motion } from "framer-motion"
import { Circle, CheckCircle2, Calendar, TrendingUp, Award, Target } from "lucide-react"
import { cn } from "../../lib/utils"

interface ElegantShapeProps {
  className?: string
  delay?: number
  width?: number
  height?: number
  rotate?: number
  gradient?: string
}

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-blue-200/[0.3]",
}: ElegantShapeProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className || "")}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
          filter: [
            "drop-shadow(0 10px 15px rgba(59, 130, 246, 0.3))",
            "drop-shadow(0 20px 30px rgba(59, 130, 246, 0.5))",
            "drop-shadow(0 10px 15px rgba(59, 130, 246, 0.3))",
          ],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-blue-200/[0.3]",
            "shadow-[0_10px_50px_0_rgba(59,130,246,0.4)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.3),transparent_70%)]",
          )}
        />
      </motion.div>
    </motion.div>
  )
}

interface HeroGeometricProps {
  badge?: string
  title1?: string
  title2?: string
  hideButtons?: boolean
}

function HeroGeometric({
  badge = "Daily Habit Tracker",
  title1 = "Visualize Success,",
  title2 = "Build Consistency",
  hideButtons = false,
}: HeroGeometricProps) {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  }

  // Generate days of the week
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  // Generate habit data for visualization
  const habits = [
    { name: "Morning Meditation", streak: 21, completion: 0.85, color: "#3B82F6" },
    { name: "Read 30 Minutes", streak: 14, completion: 0.7, color: "#8B5CF6" },
    { name: "Exercise", streak: 10, completion: 0.6, color: "#EC4899" },
    { name: "Drink Water", streak: 30, completion: 0.95, color: "#10B981" },
  ]

  // Generate last 4 weeks of data for heatmap
  const generateHeatmapData = () => {
    const data = []
    for (let week = 0; week < 4; week++) {
      const weekData = []
      for (let day = 0; day < 7; day++) {
        // More completed habits in recent weeks
        const completionChance = 0.4 + week * 0.15
        const completed = Math.random() < completionChance
        weekData.push(completed)
      }
      data.push(weekData)
    }
    return data
  }

  const heatmapData = generateHeatmapData()

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 to-violet-50">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-200/[0.1] via-transparent to-violet-200/[0.1] blur-3xl" />

      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-blue-400/[0.25]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />

        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-violet-400/[0.25]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />

        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-blue-300/[0.25]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />

        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-violet-300/[0.25]"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />

        <ElegantShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient="from-blue-300/[0.25]"
          className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        {/* Main content with side-by-side layout */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 md:gap-12">
          {/* Left side - Text and buttons */}
          <motion.div
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="w-full md:w-5/12 text-center md:text-left md:pt-12"
          >
            <motion.div
              custom={0}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/[0.5] border border-blue-200/[0.5] mb-6"
            >
              <Circle className="h-2 w-2 fill-blue-500" />
              <span className="text-sm text-blue-600 tracking-wide font-medium">{badge}</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-blue-600 to-blue-800">{title1}</span>
              <br />
              <span
                className={cn(
                  "bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-violet-500 to-blue-500",
                )}
              >
                {title2}
              </span>
            </h1>

            <p className="text-lg text-gray-700 mb-8 font-medium max-w-lg">
              HabitVault helps you build lasting habits with a minimalist, distraction-free approach. Track your daily
              progress, visualize your consistency, and achieve your goals one day at a time.
            </p>

            {!hideButtons && (
              <motion.div
                custom={2}
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-8 md:mb-0"
              >
                <a
                  href="/register"
                  className="px-8 py-3 rounded-md font-medium transition-all duration-200 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white text-center"
                >
                  Start Tracking
                </a>
                <a
                  href="/login"
                  className="px-8 py-3 rounded-md font-medium transition-colors border border-blue-200 bg-white/50 text-blue-600 hover:bg-blue-50 text-center"
                >
                  Login
                </a>
              </motion.div>
            )}
          </motion.div>

          {/* Right side - Animated Habit Visualization */}
          <motion.div
            className="w-full md:w-7/12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.8 }}
          >
            <motion.div
              className="relative w-full max-w-[600px] mx-auto h-[500px] bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-blue-200/50 overflow-hidden"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            >
              {/* Header with tabs */}
              <div className="bg-gradient-to-r from-blue-500 to-violet-500 text-white p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">Habit Dashboard</h3>
                  <div className="flex space-x-2">
                    <motion.div
                      className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center"
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.3)" }}
                    >
                      <Calendar size={18} />
                    </motion.div>
                    <motion.div
                      className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center"
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.3)" }}
                    >
                      <TrendingUp size={18} />
                    </motion.div>
                    <motion.div
                      className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center"
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.3)" }}
                    >
                      <Award size={18} />
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Main content */}
              <div className="p-6">
                {/* Current streak section */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold text-gray-700">Current Streaks</h4>
                    <span className="text-sm text-blue-600 font-medium">View All</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {habits.map((habit, index) => (
                      <motion.div
                        key={`habit-${index}`}
                        className="bg-gradient-to-br from-white to-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1 + index * 0.2 }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-gray-800">{habit.name}</h5>
                          <motion.div
                            className="flex items-center"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{
                              duration: 1.5,
                              repeat: Number.POSITIVE_INFINITY,
                              repeatType: "reverse",
                              delay: index * 0.5,
                            }}
                          >
                            <Target size={16} className="text-blue-500 mr-1" />
                            <span className="text-sm font-bold text-blue-600">{habit.streak} days</span>
                          </motion.div>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                          <motion.div
                            className="h-2.5 rounded-full"
                            style={{ backgroundColor: habit.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${habit.completion * 100}%` }}
                            transition={{ duration: 1.5, delay: 1.2 + index * 0.2, ease: "easeOut" }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Completion</span>
                          <span>{Math.round(habit.completion * 100)}%</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Heatmap section */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold text-gray-700">Monthly Overview</h4>
                    <div className="flex items-center text-sm text-blue-600 font-medium">
                      <span>April 2024</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {daysOfWeek.map((day, i) => (
                        <div key={`day-${i}`} className="text-xs text-center text-gray-500 font-medium">
                          {day}
                        </div>
                      ))}
                    </div>

                    {heatmapData.map((week, weekIndex) => (
                      <div key={`week-${weekIndex}`} className="grid grid-cols-7 gap-1 mb-1">
                        {week.map((completed, dayIndex) => (
                          <motion.div
                            key={`cell-${weekIndex}-${dayIndex}`}
                            className={`h-10 w-full rounded-md flex items-center justify-center ${
                              completed ? "bg-green-100" : "bg-gray-100"
                            }`}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{
                              scale: 1,
                              opacity: 1,
                              backgroundColor: completed
                                ? ["rgb(220 252 231)", "rgb(187 247 208)", "rgb(220 252 231)"]
                                : "rgb(243 244 246)",
                            }}
                            transition={{
                              duration: 3,
                              repeat: completed ? Number.POSITIVE_INFINITY : 0,
                              repeatType: "reverse",
                              delay: 1.5 + weekIndex * 0.1 + dayIndex * 0.05,
                            }}
                          >
                            {completed && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                  duration: 0.5,
                                  delay: 1.8 + weekIndex * 0.1 + dayIndex * 0.05,
                                  type: "spring",
                                }}
                              >
                                <CheckCircle2 className="h-6 w-6 text-green-500" />
                              </motion.div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Streak indicator */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-violet-500 text-white py-4 px-6"
                animate={{ opacity: [0.9, 1, 0.9] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 5, 0, -5, 0] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                      className="mr-2"
                    >
                      🔥
                    </motion.div>
                    <span className="font-bold text-lg">Current Streak: 21 Days</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white/20 hover:bg-white/30 px-4 py-1 rounded-full text-sm font-medium"
                  >
                    Check In Today
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-blue-50 via-transparent to-blue-50/80 pointer-events-none" />
    </div>
  )
}

export { HeroGeometric }
