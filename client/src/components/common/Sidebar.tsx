import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import Avatar from "./Avatar";
import { authService } from "../../services/authService";
import { useTheme } from "../../hooks/useThemeContext";
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";

// Define types for NavItem and NavSection
export interface NavItem {
  title: string;
  icon: ReactNode;
  path: string;
  active?: boolean;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

// Define props for the Sidebar component
interface SidebarProps {
  sections: NavSection[];
  profileData: {
    name: string;
    email: string;
    avatar?: string;
  };
  defaultOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

const Sidebar = ({ sections, profileData, defaultOpen = true, onToggle }: SidebarProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(defaultOpen);
  const { isDarkMode } = useTheme();
  // Use the profile data passed as props, but it could be enhanced with AuthContext data if needed

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      // The authService.logout function already shows a success toast and redirects to login page
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Animation variants
  const sidebarVariants = {
    expanded: { width: "18rem" },
    collapsed: { width: "5rem" },
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.aside
      initial={false}
      animate={sidebarOpen ? "expanded" : "collapsed"}
      variants={sidebarVariants}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`${isDarkMode ? 'bg-gray-800 border-gray-700 shadow-gray-900/30' : 'bg-white border-blue-100 shadow-blue-100/30'} border-r shadow-lg flex flex-col z-50 overflow-hidden h-screen fixed left-0 top-0`}
      style={{ zIndex: 40 }}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-blue-100/40 to-sky-100/40 blur-2xl" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-gradient-to-tr from-blue-100/30 to-sky-100/30 blur-3xl" />
      </div>

      {/* Logo */}
      <div className={`h-16 flex items-center px-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-blue-100'} relative`}>
        <motion.div className="flex items-center" animate={{ x: sidebarOpen ? 0 : -4 }}>
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-violet-500 text-white h-10 w-10 rounded-lg flex items-center justify-center mr-3 shadow-md shadow-blue-200 dark:shadow-gray-900"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
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
          </motion.div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                className="text-xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                HabitVault
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
        <motion.button
          onClick={toggleSidebar}
          className={cn(
            "absolute right-3 p-1.5 rounded-full transition-colors",
            isDarkMode
              ? "bg-gray-700 text-blue-400 hover:bg-gray-600 hover:text-blue-300"
              : "bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-600",
            !sidebarOpen && "right-1/2 translate-x-1/2",
          )}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </motion.button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 relative overflow-y-auto">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            {section.title && sidebarOpen && (
              <motion.p
                className={`text-xs font-medium uppercase tracking-wider px-3 mb-2 ${
                  isDarkMode ? 'text-blue-300' : 'text-blue-400'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {section.title}
              </motion.p>
            )}

            {!section.title && !sidebarOpen && sectionIndex > 0 && (
              <motion.div
                className={`border-t w-8 mx-auto my-4 ${
                  isDarkMode ? 'border-gray-700' : 'border-blue-100'
                }`}
                initial={{ width: 0 }}
                animate={{ width: 32 }}
                transition={{ delay: 0.3 }}
              />
            )}

            <motion.ul className="space-y-2" variants={staggerContainer} initial="initial" animate="animate">
              {section.items.map((item, index) => (
                <motion.li key={index} variants={fadeInUp}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center px-3 py-2.5 rounded-lg font-medium transition-all duration-200",
                      item.active
                        ? "bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-md shadow-blue-200/50 dark:shadow-gray-900/50"
                        : isDarkMode
                          ? "text-blue-400 hover:bg-gradient-to-r hover:from-blue-500 hover:to-sky-500 hover:text-white hover:shadow-md hover:shadow-gray-900/50"
                          : "text-blue-600 hover:bg-gradient-to-r hover:from-blue-500 hover:to-sky-500 hover:text-white hover:shadow-md hover:shadow-blue-200/50",
                      !sidebarOpen && "justify-center",
                    )}
                  >
                    <div className={cn("flex-shrink-0", sidebarOpen ? "mr-3" : "")}>
                      {item.icon}
                    </div>
                    <AnimatePresence>
                      {sidebarOpen && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {item.title}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <motion.div
        className={cn(
          `border-t p-4 relative ${isDarkMode ? 'border-gray-700' : 'border-blue-100'}`,
          sidebarOpen ? "flex items-center" : "flex flex-col items-center",
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div whileHover={{ scale: 1.05 }}>
          <Avatar name={profileData.name} showStatus={true} />
        </motion.div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              className="ml-3 flex-1 min-w-0"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <p className={`text-sm font-medium truncate ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {profileData.name}
              </p>
              <p className={`text-xs truncate ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`}>
                {profileData.email}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {sidebarOpen ? (
            <motion.button
              onClick={handleLogout}
              className={`transition-colors ${
                isDarkMode
                  ? 'text-blue-400 hover:text-blue-300'
                  : 'text-blue-500 hover:text-blue-700'
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Logout"
            >
              <LogOut size={18} />
            </motion.button>
          ) : (
            <motion.button
              onClick={handleLogout}
              className={`mt-4 transition-colors ${
                isDarkMode
                  ? 'text-blue-400 hover:text-blue-300'
                  : 'text-blue-500 hover:text-blue-700'
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Logout"
            >
              <LogOut size={18} />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.aside>
  );
};

export default Sidebar;
