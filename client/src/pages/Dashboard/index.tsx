"use client"

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Home,
  BarChart2,
  Settings,
  Zap,
  Calendar,
  Layers,
  Check,
  Menu,
  Activity,
  Moon,
  Sun,
} from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import MobileMenu from "../../components/common/MobileMenu";
import WelcomeSection from "../../components/dashboard/WelcomeSection";
import QuoteSection from "../../components/dashboard/QuoteSection";
import StatsSummaryCards from "../../components/dashboard/StatsSummaryCards";
import TodaysHabits from "../../components/dashboard/TodaysHabits";
import RecentActivity from "../../components/dashboard/RecentActivity";
import type { NavSection } from "../../components/common/Sidebar";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { useAuthContext } from "../../context/AuthContext";
import { useDashboardData } from "../../hooks/useDashboardData";
import { DashboardProvider } from "../../contexts/DashboardContext";
import { useTheme } from "../../hooks/useThemeContext";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user } = useAuthContext()
  const { isDarkMode, toggleDarkMode } = useTheme()

  const dashboardData = useDashboardData()
  const isMobile = useIsMobile()

  // Get the refresh function from the dashboard data
  const refreshDashboard = dashboardData.refreshData

  const handleSidebarToggle = (isOpen: boolean) => {
    setSidebarOpen(isOpen)

    // Update CSS variable for sidebar width
    document.documentElement.style.setProperty('--sidebar-width', isOpen ? '18rem' : '5rem')
  }

  // Set initial CSS variable on component mount
  useEffect(() => {
    // Only set sidebar width on desktop
    if (!isMobile) {
      document.documentElement.style.setProperty('--sidebar-width', sidebarOpen ? '18rem' : '5rem')
    } else {
      // On mobile, set sidebar width to 0
      document.documentElement.style.setProperty('--sidebar-width', '0')
    }
  }, [isMobile, sidebarOpen])

  // Navigation sections for the sidebar
  const navSections: NavSection[] = [
    {
      items: [
        { title: "Dashboard", icon: <Home size={20} />, path: "/dashboard", active: true },
        { title: "Habits", icon: <Layers size={20} />, path: "/habits" },
        { title: "Calendar", icon: <Calendar size={20} />, path: "/calendar" },
        { title: "Analytics", icon: <BarChart2 size={20} />, path: "/analytics" },
      ],
    },
    {
      title: "Account",
      items: [
        { title: "Settings", icon: <Settings size={20} />, path: "/settings" },
        { title: "Activity", icon: <Activity size={20} />, path: "/activity" },
      ],
    },
  ]

  // User profile data for the sidebar - use authenticated user data if available
  const profileData = user ? {
    name: user.name,
    email: user.email,
  } : {
    name: "Guest User",
    email: "guest@example.com",
  }

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

  return (
    <DashboardProvider refreshFunction={refreshDashboard}>
      <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-sky-50'} relative`}>
        {/* Mobile Menu */}
        <MobileMenu
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          profileData={profileData}
        >
        {/* Mobile Navigation */}
        <nav className="py-4">
          {navSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6 px-4">
              {section.title && (
                <p className="text-xs font-medium text-blue-400 uppercase tracking-wider mb-2">
                  {section.title}
                </p>
              )}

              {!section.title && sectionIndex > 0 && (
                <div className="border-t border-blue-100 w-full my-4" />
              )}

              <ul className="space-y-2">
                {section.items.map((item, index) => (
                  <li key={index}>
                    <a
                      href={item.path}
                      className={`flex items-center px-3 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                        item.active
                          ? "bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-md shadow-blue-200/50"
                          : "text-blue-600 hover:bg-gradient-to-r hover:from-blue-500 hover:to-sky-500 hover:text-white hover:shadow-md hover:shadow-blue-200/50"
                      }`}
                    >
                      <div className="flex-shrink-0 mr-3">{item.icon}</div>
                      <span>{item.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </MobileMenu>

      {/* Desktop Sidebar - Only show on non-mobile */}
      {!isMobile && (
        <Sidebar
          sections={navSections}
          profileData={profileData}
          defaultOpen={sidebarOpen}
          onToggle={handleSidebarToggle}
        />
      )}

      {/* Main Content */}
      <div
        style={{ left: isMobile ? '0' : 'var(--sidebar-width)' }}
        className="absolute top-0 right-0 bottom-0 flex flex-col transition-all duration-300 h-screen overflow-hidden"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-b ${isDarkMode ? 'from-blue-900/20' : 'from-blue-100/30'} to-transparent rounded-bl-full blur-3xl`} />
          <div className={`absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-t ${isDarkMode ? 'from-sky-900/20' : 'from-sky-100/30'} to-transparent rounded-tr-full blur-3xl`} />
        </div>

        {/* Header */}
        <header className={`${isDarkMode ? 'bg-gray-800/70 border-gray-700' : 'bg-white/70 border-blue-100'} backdrop-blur-md border-b h-16 flex items-center px-6 sticky top-0 z-10 shadow-sm`}>
          <div className="flex-1 flex items-center">
            {/* Hamburger menu for mobile */}
            {isMobile && (
              <motion.button
                onClick={() => setMobileMenuOpen(true)}
                className={`mr-4 p-1.5 rounded-full ${
                  isDarkMode
                    ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-800/40 hover:text-blue-300'
                    : 'bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-600'
                } transition-colors`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Menu size={20} />
              </motion.button>
            )}
            <motion.h1
              className="text-xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Dashboard
            </motion.h1>
          </div>

          {/* Theme Toggle Button */}
          <motion.button
            onClick={() => toggleDarkMode()}
            className={`p-2 rounded-full ${
              isDarkMode
                ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-800/40 hover:text-blue-300'
                : 'bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-600'
            } transition-colors`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto relative h-[calc(100vh-4rem)]">
          {/* Welcome Section */}
          <WelcomeSection
            username={user ? user.name.split(' ')[0] : 'Guest'}
          />

          {/* Motivational Quote Section */}
          <QuoteSection />

          {/* Dashboard Stats Summary Cards */}
          <StatsSummaryCards />

          {/* Today's Habits Section */}
          <TodaysHabits />

          {/* Stats Grid */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent mb-4">
              Stats Overview
            </h2>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {[
                {
                  title: "Weekly Progress",
                  value: dashboardData.loading ? "..." : `${Math.round(dashboardData.weeklyProgress)}%`,
                  icon: BarChart2,
                  trend: dashboardData.loading ? "Loading..." : dashboardData.weeklyProgressTrend.value,
                  trendType: dashboardData.loading ? "neutral" : dashboardData.weeklyProgressTrend.type,
                  description: "Habits completed this week"
                },
                {
                  title: "Longest Streak",
                  value: dashboardData.loading ? "..." : `${dashboardData.longestStreak} days`,
                  icon: Activity,
                  trend: dashboardData.loading ? "Loading..." : dashboardData.longestStreakTrend.value,
                  trendType: dashboardData.loading ? "neutral" : dashboardData.longestStreakTrend.type,
                  description: "Your best consistency record"
                },
                {
                  title: "Completion Rate",
                  value: dashboardData.loading ? "..." : `${Math.round(dashboardData.completionRate)}%`,
                  icon: Zap,
                  trend: dashboardData.loading ? "Loading..." : dashboardData.completionRateTrend.value,
                  trendType: dashboardData.loading ? "neutral" : dashboardData.completionRateTrend.type,
                  description: "Overall habit completion"
                },
                {
                  title: "Habits Completed",
                  value: dashboardData.loading ? "..." : `${dashboardData.completedToday} today`,
                  icon: Check,
                  trend: dashboardData.loading ? "Loading..." : dashboardData.completedTodayTrend.value,
                  trendType: dashboardData.loading ? "neutral" : dashboardData.completedTodayTrend.type,
                  description: "Completed habits for today"
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.title}
                  variants={fadeInUp}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-100'} rounded-xl border p-6 shadow-md hover:shadow-lg transition-all duration-300`}
                  whileHover={{ y: -5, boxShadow: isDarkMode ? "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)" : "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)" }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} text-sm font-semibold`}>{stat.title}</h3>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>{stat.description}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-full ${isDarkMode ? 'bg-gradient-to-br from-blue-900/30 to-sky-900/30' : 'bg-gradient-to-br from-blue-100 to-sky-100'} flex items-center justify-center`}>
                      <stat.icon size={18} className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    </div>
                  </div>
                  <div className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-1`}>
                    {typeof stat.value === 'string' ? (
                      <p className="text-3xl font-bold">{stat.value}</p>
                    ) : (
                      stat.value
                    )}
                  </div>
                  {stat.trend && (
                    <p className={`text-sm flex items-center mt-2 font-medium ${
                      stat.trendType === 'positive'
                        ? isDarkMode ? 'text-green-400' : 'text-green-600'
                        : stat.trendType === 'negative'
                          ? isDarkMode ? 'text-red-400' : 'text-red-500'
                          : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <span className="flex items-center">
                        {stat.trendType === 'positive' ? (
                          <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 2L6 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 6L6 2L10 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : stat.trendType === 'negative' ? (
                          <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 2L6 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 6L6 10L10 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 6L10 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                        {stat.trend}
                      </span>
                    </p>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Authentication Test component removed */}

          {/* Recent Activity */}
          <RecentActivity limit={4} />
        </main>
      </div>
      </div>
    </DashboardProvider>
  );
}

export default Dashboard;
