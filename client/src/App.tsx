import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from './routes';
import { ToastProvider } from './components/common/Toast';
import { DashboardProvider } from './contexts/DashboardContext';

function App() {
  // This is a placeholder refresh function that will be replaced by the actual function
  // from useDashboardData in the Dashboard component
  const dummyRefreshFunction = async () => {
    console.log('Dashboard refresh function not yet initialized');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <ToastProvider />
            <DashboardProvider refreshFunction={dummyRefreshFunction}>
              <AppRoutes />
            </DashboardProvider>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
