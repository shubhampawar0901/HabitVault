import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Quote, Bell, Moon, Sun, ArrowLeft } from "lucide-react";
import { showToast } from "../../components/common/Toast";
import { useTheme } from "../../hooks/useThemeContext";
import { useNavigate } from "react-router-dom";

interface SettingsOption {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
}

const Settings = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const [settings, setSettings] = useState<SettingsOption[]>([
    {
      id: "showMotivationalQuote",
      label: "Daily Motivational Quotes",
      description: "Show daily motivational quotes on your dashboard",
      icon: <Quote size={20} />,
      enabled: true,
    },
    {
      id: "darkMode",
      label: "Dark Mode",
      description: "Use dark theme throughout the application",
      icon: isDarkMode ? <Moon size={20} /> : <Sun size={20} />,
      enabled: isDarkMode,
    },
    {
      id: "notifications",
      label: "Notifications",
      description: "Receive notifications for habit reminders",
      icon: <Bell size={20} />,
      enabled: true,
    },
  ]);

  // Load settings from localStorage and update when dark mode changes
  useEffect(() => {
    // Load settings from localStorage
    const loadSettingsFromStorage = () => {
      const showQuotes = localStorage.getItem("showMotivationalQuote");
      const notifications = localStorage.getItem("notifications");

      setSettings(prevSettings =>
        prevSettings.map(setting => {
          if (setting.id === "darkMode") {
            return { ...setting, enabled: isDarkMode };
          } else if (setting.id === "showMotivationalQuote" && showQuotes !== null) {
            return { ...setting, enabled: showQuotes === "true" };
          } else if (setting.id === "notifications" && notifications !== null) {
            return { ...setting, enabled: notifications === "true" };
          }
          return setting;
        })
      );
    };

    loadSettingsFromStorage();
  }, [isDarkMode]);

  // Handle toggle change
  const handleToggle = (id: string) => {
    // Special handling for dark mode
    if (id === "darkMode") {
      toggleDarkMode();
      showToast.success(`Dark Mode ${!isDarkMode ? 'enabled' : 'disabled'}`);
      return;
    }

    // Handle other settings
    const updatedSettings = settings.map((setting) => {
      if (setting.id === id) {
        const newEnabled = !setting.enabled;
        // Save to localStorage
        localStorage.setItem(id, newEnabled.toString());

        // Show toast notification
        showToast.success(`${setting.label} ${newEnabled ? 'enabled' : 'disabled'}`);

        return { ...setting, enabled: newEnabled };
      }
      return setting;
    });
    setSettings(updatedSettings);
  };

  // Handle back button click
  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-50 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="flex items-center mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            onClick={handleBack}
            className="mr-3 p-2 rounded-full bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <SettingsIcon className="text-blue-600 dark:text-blue-400 mr-3" size={24} />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
            Settings
          </h1>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl border border-blue-100 dark:border-gray-700 p-4 sm:p-6 shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Motivational Features</h2>

          {settings.filter(s => s.id === "showMotivationalQuote").map((setting, index) => (
            <motion.div
              key={setting.id}
              className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                  {setting.icon}
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">{setting.label}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{setting.description}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={setting.enabled}
                  onChange={() => handleToggle(setting.id)}
                  aria-label={`Toggle ${setting.label}`}
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </motion.div>
          ))}

          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-4">Appearance</h2>

          {settings.filter(s => s.id === "darkMode").map((setting, index) => (
            <motion.div
              key={setting.id}
              className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + 0.1 * index }}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                  {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">{setting.label}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{setting.description}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={setting.enabled}
                  onChange={() => handleToggle(setting.id)}
                  aria-label={`Toggle ${setting.label}`}
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </motion.div>
          ))}

          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-4">Notifications</h2>

          {settings.filter(s => s.id === "notifications").map((setting, index) => (
            <motion.div
              key={setting.id}
              className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + 0.1 * index }}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                  {setting.icon}
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">{setting.label}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{setting.description}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={setting.enabled}
                  onChange={() => handleToggle(setting.id)}
                  aria-label={`Toggle ${setting.label}`}
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
export default Settings;
