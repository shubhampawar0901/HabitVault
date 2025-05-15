"use client"

import { Link } from "react-router-dom"
import { HeroGeometric } from "../../components/landing/HeroGeometric"
import { Heart, CheckCircle, BarChart2, Calendar, Clock } from "lucide-react"
import { motion } from "framer-motion"

const Home = () => {
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i:number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white/80 text-gray-800 p-4 sticky top-0 left-0 right-0 z-50 border-b border-blue-100 backdrop-blur-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-500 to-violet-500 text-white h-8 w-8 rounded-md flex items-center justify-center mr-2 shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z"
                  fill="white"
                />
                <path d="M16 10.8L14.8 9.6L11 13.4L9.2 11.6L8 12.8L11 15.8L16 10.8Z" fill="white" />
                <path d="M11 7H13V9H11V7Z" fill="white" />
                <path d="M7 11H9V13H7V11Z" fill="white" />
                <path d="M15 11H17V13H15V11Z" fill="white" />
              </svg>
            </div>
            <span className="text-xl font-bold text-blue-600">HabitVault</span>
          </div>
          <nav>
            <ul className="flex gap-4">
              <li>
                <Link to="/login" className="text-blue-600 hover:text-blue-800 transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-blue-600 hover:text-blue-800 transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <HeroGeometric badge="Daily Habit Tracker" title1="Visualize Success," title2="Build Consistency" />

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-3xl font-bold text-center mb-2"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              How It Works
            </motion.h2>
            <motion.p
              className="text-center text-gray-600 mb-12"
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Three simple steps to building your consistent habits
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <motion.div
                className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 text-center shadow-md border border-blue-100 relative overflow-hidden"
                custom={0}
                variants={fadeInUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)",
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100/50 rounded-bl-full -mr-8 -mt-8"></div>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                  >
                    <CheckCircle className="h-8 w-8 text-blue-600" />
                  </motion.div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-blue-700">Add Your Habits</h3>
                <p className="text-gray-600">
                  Create personalized habits with custom schedules, names, and start dates.
                </p>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                className="bg-gradient-to-br from-violet-50 to-white rounded-xl p-6 text-center shadow-md border border-violet-100 relative overflow-hidden"
                custom={1}
                variants={fadeInUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(139, 92, 246, 0.1), 0 8px 10px -6px rgba(139, 92, 246, 0.1)",
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-violet-100/50 rounded-bl-full -mr-8 -mt-8"></div>
                <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <motion.div
                    animate={{ rotate: [0, 5, 0, -5, 0] }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                  >
                    <Calendar className="h-8 w-8 text-violet-600" />
                  </motion.div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-violet-700">Daily Check-ins</h3>
                <p className="text-gray-600">
                  Mark habits as complete each day and build streaks for consistent performance.
                </p>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 text-center shadow-md border border-blue-100 relative overflow-hidden"
                custom={2}
                variants={fadeInUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)",
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100/50 rounded-bl-full -mr-8 -mt-8"></div>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                  >
                    <BarChart2 className="h-8 w-8 text-blue-600" />
                  </motion.div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-blue-700">Track Your Progress</h3>
                <p className="text-gray-600">
                  Visualize your habit history with heatmaps and analyze your performance over time.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-br from-blue-50 to-violet-50">
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-3xl font-bold text-center mb-2"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Success Stories
            </motion.h2>
            <motion.p
              className="text-center text-gray-600 mb-12"
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              See how HabitVault has helped people build lasting habits
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <motion.div
                className="bg-white p-6 rounded-xl shadow-md flex flex-col h-full border border-blue-100 relative overflow-hidden"
                custom={0}
                variants={fadeInUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)",
                }}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100/20 rounded-bl-full -mr-8 -mt-8"></div>
                <div className="text-blue-400 text-4xl mb-4">"</div>
                <p className="text-gray-700 flex-grow">
                  HabitVault's visual streaks kept me motivated to maintain my daily meditation practice. After 60 days,
                  it's now an essential part of my morning routine that I can't imagine skipping.
                </p>
                <div className="flex items-center mt-6 pt-4 border-t border-gray-100">
                  <div className="relative">
                    <img
                      src="https://randomuser.me/api/portraits/women/44.jpg"
                      alt="Sarah Johnson"
                      className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-blue-200"
                    />
                    <motion.div
                      className="absolute -top-1 -right-1 bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <Clock className="h-3 w-3 text-white" />
                    </motion.div>
                  </div>
                  <div>
                    <span className="font-semibold text-sm block text-gray-800">Sarah Johnson</span>
                    <span className="text-blue-600 text-xs font-medium">90-day streak</span>
                  </div>
                </div>
              </motion.div>

              {/* Testimonial 2 */}
              <motion.div
                className="bg-white p-6 rounded-xl shadow-md flex flex-col h-full border border-violet-100 relative overflow-hidden"
                custom={1}
                variants={fadeInUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(139, 92, 246, 0.1), 0 8px 10px -6px rgba(139, 92, 246, 0.1)",
                }}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-violet-100/20 rounded-bl-full -mr-8 -mt-8"></div>
                <div className="text-violet-400 text-4xl mb-4">"</div>
                <p className="text-gray-700 flex-grow">
                  I tried many habit trackers, but they were all too complicated. HabitVault's minimalist design helps
                  me focus on what matters - building consistent habits without distractions.
                </p>
                <div className="flex items-center mt-6 pt-4 border-t border-gray-100">
                  <div className="relative">
                    <img
                      src="https://randomuser.me/api/portraits/men/32.jpg"
                      alt="Michael Chen"
                      className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-violet-200"
                    />
                    <motion.div
                      className="absolute -top-1 -right-1 bg-violet-500 rounded-full w-5 h-5 flex items-center justify-center"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.3 }}
                    >
                      <Clock className="h-3 w-3 text-white" />
                    </motion.div>
                  </div>
                  <div>
                    <span className="font-semibold text-sm block text-gray-800">Michael Chen</span>
                    <span className="text-violet-600 text-xs font-medium">45-day streak</span>
                  </div>
                </div>
              </motion.div>

              {/* Testimonial 3 */}
              <motion.div
                className="bg-white p-6 rounded-xl shadow-md flex flex-col h-full border border-blue-100 relative overflow-hidden"
                custom={2}
                variants={fadeInUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)",
                }}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100/20 rounded-bl-full -mr-8 -mt-8"></div>
                <div className="text-blue-400 text-4xl mb-4">"</div>
                <p className="text-gray-700 flex-grow">
                  The heatmap visualization is incredibly satisfying. Seeing those green squares fill up my calendar
                  motivates me to keep my exercise streak going, even on days when I don't feel like it.
                </p>
                <div className="flex items-center mt-6 pt-4 border-t border-gray-100">
                  <div className="relative">
                    <img
                      src="https://randomuser.me/api/portraits/women/68.jpg"
                      alt="Priya Sharma"
                      className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-blue-200"
                    />
                    <motion.div
                      className="absolute -top-1 -right-1 bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.6 }}
                    >
                      <Clock className="h-3 w-3 text-white" />
                    </motion.div>
                  </div>
                  <div>
                    <span className="font-semibold text-sm block text-gray-800">Priya Sharma</span>
                    <span className="text-blue-600 text-xs font-medium">120-day streak</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              <motion.div
                className="text-center bg-white p-6 rounded-xl shadow-md border border-blue-100"
                custom={0}
                variants={fadeInUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)",
                }}
              >
                <motion.div
                  className="text-3xl font-bold text-blue-600 mb-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  10,000+
                </motion.div>
                <p className="text-gray-600">Active Users</p>
              </motion.div>

              <motion.div
                className="text-center bg-white p-6 rounded-xl shadow-md border border-violet-100"
                custom={1}
                variants={fadeInUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(139, 92, 246, 0.1), 0 8px 10px -6px rgba(139, 92, 246, 0.1)",
                }}
              >
                <motion.div
                  className="text-3xl font-bold text-violet-600 mb-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  500,000+
                </motion.div>
                <p className="text-gray-600">Habits Tracked</p>
              </motion.div>

              <motion.div
                className="text-center bg-white p-6 rounded-xl shadow-md border border-blue-100"
                custom={2}
                variants={fadeInUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)",
                }}
              >
                <motion.div
                  className="text-3xl font-bold text-blue-600 mb-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  74%
                </motion.div>
                <p className="text-gray-600">Completion Rate</p>
              </motion.div>

              <motion.div
                className="text-center bg-white p-6 rounded-xl shadow-md border border-violet-100"
                custom={3}
                variants={fadeInUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(139, 92, 246, 0.1), 0 8px 10px -6px rgba(139, 92, 246, 0.1)",
                }}
              >
                <motion.div
                  className="text-3xl font-bold text-violet-600 mb-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  30+
                </motion.div>
                <p className="text-gray-600">Days Avg. Streak</p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-blue-500 to-violet-500 text-white h-8 w-8 rounded-md flex items-center justify-center mr-2 shadow-sm">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z"
                      fill="white"
                    />
                    <path d="M16 10.8L14.8 9.6L11 13.4L9.2 11.6L8 12.8L11 15.8L16 10.8Z" fill="white" />
                    <path d="M11 7H13V9H11V7Z" fill="white" />
                    <path d="M7 11H9V13H7V11Z" fill="white" />
                    <path d="M15 11H17V13H15V11Z" fill="white" />
                  </svg>
                </div>
                <span className="text-xl font-bold">HabitVault</span>
              </div>
              <p className="text-gray-400 text-sm">
                Empowering people to build lasting habits through consistency, visual feedback, and a minimalist
                approach.
              </p>
              <div className="flex space-x-4">
                <motion.span
                  className="text-gray-400 hover:text-white cursor-pointer"
                  whileHover={{ scale: 1.2, color: "#ffffff" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                    <path d="M9 18c-4.51 2-5-2-7-2"></path>
                  </svg>
                </motion.span>
                <motion.span
                  className="text-gray-400 hover:text-white cursor-pointer"
                  whileHover={{ scale: 1.2, color: "#ffffff" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </motion.span>
                <motion.span
                  className="text-gray-400 hover:text-white cursor-pointer"
                  whileHover={{ scale: 1.2, color: "#ffffff" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </motion.span>
              </div>
            </div>

            {/* Platform */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-2">
                <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">How it Works</span>
                </motion.li>
                <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">Features</span>
                </motion.li>
                <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">FAQ</span>
                </motion.li>
                <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">Premium</span>
                </motion.li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">About Us</span>
                </motion.li>
                <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">Careers</span>
                </motion.li>
                <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">Blog</span>
                </motion.li>
                <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">Contact</span>
                </motion.li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">
                    Terms of Service
                  </span>
                </motion.li>
                <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">
                    Privacy Policy
                  </span>
                </motion.li>
                <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">Cookie Policy</span>
                </motion.li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} HabitVault. All rights reserved.</p>
            <p className="text-gray-400 text-sm flex items-center mt-4 md:mt-0">
              Made with <Heart size={16} className="mx-1 text-red-500" /> by talented developers
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
