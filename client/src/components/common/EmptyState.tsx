import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, Plus, Calendar, Target, TrendingUp } from 'lucide-react';
import { useTheme } from '../../hooks/useThemeContext';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  actionLink?: string;
  type?: 'habits' | 'checkins' | 'analytics' | 'generic';
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionText = 'Add Your First Habit',
  actionLink = '/habits/new',
  type = 'generic'
}) => {
  const { isDarkMode } = useTheme();

  // Default content based on type
  const getDefaultContent = () => {
    switch (type) {
      case 'habits':
        return {
          title: title || 'No habits found',
          description: description || 'Regular habits help build lasting change. Add your first habit to get started!',
          icon: icon || <CheckCircle size={32} className={`${isDarkMode ? 'text-blue-400' : 'text-blue-300'}`} />
        };
      case 'checkins':
        return {
          title: title || 'No habits scheduled for today',
          description: description || 'You don\'t have any habits scheduled for today. Enjoy your day off or add a new habit!',
          icon: icon || <Calendar size={32} className={`${isDarkMode ? 'text-blue-400' : 'text-blue-300'}`} />
        };
      case 'analytics':
        return {
          title: title || 'No data to analyze yet',
          description: description || 'Complete your habits consistently to see your progress analytics here.',
          icon: icon || <TrendingUp size={32} className={`${isDarkMode ? 'text-blue-400' : 'text-blue-300'}`} />
        };
      default:
        return {
          title: title || 'Nothing here yet',
          description: description || 'Get started by adding your first item.',
          icon: icon || <Target size={32} className={`${isDarkMode ? 'text-blue-400' : 'text-blue-300'}`} />
        };
    }
  };

  const content = getDefaultContent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-100'} rounded-xl border p-6 text-center shadow-sm`}
    >
      <div className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'} rounded-full flex items-center justify-center`}>
        {content.icon}
      </div>
      <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>
        {content.title}
      </h3>
      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6 max-w-md mx-auto`}>
        {content.description}
      </p>
      <Link
        to={actionLink}
        className={`inline-flex items-center px-4 py-2 ${
          isDarkMode 
            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
            : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
        } rounded-lg transition-colors`}
      >
        <Plus size={16} className="mr-2" />
        {actionText}
      </Link>
    </motion.div>
  );
};

export default EmptyState;
