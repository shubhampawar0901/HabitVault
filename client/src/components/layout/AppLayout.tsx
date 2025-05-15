import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Home,
  BarChart2,
  Settings,
  Calendar,
  Layers,
  Menu,
  Activity,
  Moon,
  Sun,
} from "lucide-react";
import Sidebar from "../common/Sidebar";
import MobileMenu from "../common/MobileMenu";
import type { NavSection } from "../common/Sidebar";
import { useIsMobile, useIsMobileOrTablet, useIsTablet } from "../../hooks/useMediaQuery";
import { useAuthContext } from "../../context/AuthContext";
import { useTheme } from "../../hooks/useThemeContext";
import { Link, useLocation } from "react-router-dom";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isMobileOrTablet = useIsMobileOrTablet();

  // Set default sidebar state - closed for tablet, open for desktop
  const [sidebarOpen, setSidebarOpen] = useState(!isTablet);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user } = useAuthContext();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const location = useLocation();

  const handleSidebarToggle = (isOpen: boolean) => {
    setSidebarOpen(isOpen);

    // Update CSS variable for sidebar width
    document.documentElement.style.setProperty('--sidebar-width', isOpen ? '18rem' : '5rem');
  };

  // Profile data for sidebar
  const profileData = {
    name: user?.name || "User",
    email: user?.email || "user@example.com",
    avatar: user?.avatar || undefined,
  };

  // Navigation sections for sidebar
  const navSections: NavSection[] = [
    {
      items: [
        {
          title: "Dashboard",
          path: "/dashboard",
          icon: <Home size={20} />,
          active: location.pathname === "/dashboard",
        },
        {
          title: "Habits",
          path: "/habits",
          icon: <Layers size={20} />,
          active: location.pathname.startsWith("/habits"),
        },
        {
          title: "Analytics",
          path: "/analytics",
          icon: <BarChart2 size={20} />,
          active: location.pathname === "/analytics",
        },
        // Calendar item removed from sidebar
      ],
    },
    {
      title: "Account",
      items: [
        {
          title: "Settings",
          path: "/settings",
          icon: <Settings size={20} />,
          active: location.pathname === "/settings",
        },
        {
          title: "Activity",
          path: "/activity",
          icon: <Activity size={20} />,
          active: location.pathname === "/activity",
        },
      ],
    },
  ];

  return (
    <div className={`min-h-screen relative ${isDarkMode
      ? 'bg-gradient-to-br from-gray-900 to-gray-800'
      : 'bg-gradient-to-br from-blue-50 to-sky-50'}`}>
      {/* Mobile Menu - For both mobile and tablet */}
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
                    <Link
                      to={item.path}
                      className={`flex items-center px-3 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                        item.active
                          ? "bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-md shadow-blue-200/50"
                          : "text-blue-600 hover:bg-gradient-to-r hover:from-blue-500 hover:to-sky-500 hover:text-white hover:shadow-md hover:shadow-blue-200/50"
                      }`}
                    >
                      <div className="flex-shrink-0 mr-3">{item.icon}</div>
                      <span>{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </MobileMenu>

      {/* Desktop Sidebar - Only show on desktop screens */}
      {!isMobileOrTablet && (
        <Sidebar
          sections={navSections}
          profileData={profileData}
          defaultOpen={sidebarOpen}
          onToggle={handleSidebarToggle}
        />
      )}

      {/* Tablet Sidebar - Hidden by default, shown when toggled */}
      {isTablet && sidebarOpen && (
        <>
          {/* Backdrop overlay for tablet */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30"
            onClick={() => setSidebarOpen(false)}
          />
          <Sidebar
            sections={navSections}
            profileData={profileData}
            defaultOpen={true}
            onToggle={handleSidebarToggle}
          />
        </>
      )}

      {/* Main Content */}
      <div
        style={{
          left: isMobileOrTablet
            ? '0'
            : 'var(--sidebar-width)',
          width: isTablet && sidebarOpen
            ? 'calc(100% - var(--sidebar-width))'
            : 'auto'
        }}
        className="absolute top-0 right-0 bottom-0 flex flex-col transition-all duration-300 h-screen overflow-hidden"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-b from-blue-100/30 to-transparent rounded-bl-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-t from-sky-100/30 to-transparent rounded-tr-full blur-3xl" />
        </div>

        {/* Header */}
        <header className="h-16 px-4 flex items-center justify-between bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-blue-100/50 dark:border-gray-700/50 z-10">
          {/* Mobile menu button - Show on mobile */}
          {isMobile && (
            <motion.button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Menu size={24} />
            </motion.button>
          )}

          {/* Tablet hamburger menu - Show on tablet */}
          {isTablet && (
            <motion.button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Menu size={24} />
            </motion.button>
          )}

          {/* Theme Toggle Button */}
          <motion.button
            onClick={() => toggleDarkMode()}
            className="p-2 rounded-lg text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto relative h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
