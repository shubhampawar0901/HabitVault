import { type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, LogOut } from "lucide-react";
import { authService } from "../../services/authService";
import { useTheme } from "../../hooks/useThemeContext";
import Avatar from "./Avatar";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  profileData: {
    name: string;
    email: string;
    avatar?: string;
  };
}

const MobileMenu = ({ isOpen, onClose, children, profileData }: MobileMenuProps) => {
  const { isDarkMode } = useTheme();

  // Animation variants
  const overlayVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 },
  };

  const menuVariants = {
    closed: { x: "-100%", opacity: 0.5 },
    open: { x: 0, opacity: 1 },
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      // The authService.logout function already shows a success toast and redirects to login page
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
          initial="closed"
          animate="open"
          exit="closed"
          variants={overlayVariants}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            className={`absolute top-0 left-0 bottom-0 w-[85%] max-w-[320px] ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white'} shadow-xl flex flex-col`}
            variants={menuVariants}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with close button */}
            <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-blue-100'}`}>
              <div className="flex items-center">
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
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
                  HabitVault
                </span>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700 text-blue-400' : 'hover:bg-blue-50 text-blue-500'} transition-colors`}
              >
                <X size={20} />
              </button>
            </div>



            {/* Navigation content */}
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>

            {/* User profile */}
            <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-blue-100'} p-4 flex items-center`}>
              <Avatar name={profileData.name} showStatus={true} />
              <div className="ml-3 flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{profileData.name}</p>
                <p className={`text-xs truncate ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`}>{profileData.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className={`ml-2 p-2 rounded-full ${
                  isDarkMode
                    ? 'text-blue-400 hover:bg-gray-700'
                    : 'text-blue-500 hover:bg-blue-50'
                } transition-colors`}
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
