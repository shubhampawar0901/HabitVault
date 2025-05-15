import { Toaster } from 'react-hot-toast';
import { useTheme } from '../../../hooks/useThemeContext';

// Re-export showToast from toast-utils.tsx
export { showToast } from './toast-utils.tsx';

/**
 * Toast provider component to be used at the app root
 */
export const ToastProvider = () => {
  const { isDarkMode } = useTheme();

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 5000,
        style: {
          background: isDarkMode ? '#1f2937' : '#fff',
          color: isDarkMode ? '#e5e7eb' : '#333',
          boxShadow: isDarkMode
            ? '0 4px 12px rgba(0, 0, 0, 0.3)'
            : '0 4px 12px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          padding: '16px',
        },
        success: {
          style: {
            borderLeft: '4px solid #10B981',
          },
        },
        error: {
          style: {
            borderLeft: '4px solid #EF4444',
          },
          duration: 6000,
        },
        loading: {
          style: {
            borderLeft: '4px solid #3B82F6',
          },
        },
      }}
    />
  );
};
