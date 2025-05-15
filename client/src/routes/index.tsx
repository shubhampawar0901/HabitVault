import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import PublicRoute from '../components/common/PublicRoute';

// Pages
import HomePage from '../pages/Home';
import LoginPage from '../pages/Login';
import RegisterPage from '../pages/Register';
import DashboardPage from '../pages/Dashboard';
import SettingsPage from '../pages/Settings';
import AnalyticsPage from '../pages/Analytics';
import CalendarPage from '../pages/Calendar';
import ActivityPage from '../pages/Activity';

// Habit Pages
import HabitsPage from '../pages/Habits';
import AddHabitPage from '../pages/Habits/AddHabit';
import HabitDetailPage from '../pages/Habits/HabitDetail';
import EditHabitPage from '../pages/Habits/EditHabit';

// Demo Pages
import HabitCardDemo from '../pages/Demo/HabitCardDemo';

// Using imported ProtectedRoute and PublicRoute components

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <HomePage />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path="/progress"
        element={
          <ProtectedRoute>
            <div>Progress Demo Page (to be implemented)</div>
          </ProtectedRoute>
        }
      />

      {/* Dashboard route (protected) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      {/* Analytics route */}
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <AnalyticsPage />
          </ProtectedRoute>
        }
      />

      {/* Calendar route */}
      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <CalendarPage />
          </ProtectedRoute>
        }
      />

      {/* Activity route */}
      <Route
        path="/activity"
        element={
          <ProtectedRoute>
            <ActivityPage />
          </ProtectedRoute>
        }
      />

      {/* Habits routes */}
      <Route
        path="/habits"
        element={
          <ProtectedRoute>
            <HabitsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/habits/new"
        element={
          <ProtectedRoute>
            <AddHabitPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/habits/:id"
        element={
          <ProtectedRoute>
            <HabitDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/habits/:id/edit"
        element={
          <ProtectedRoute>
            <EditHabitPage />
          </ProtectedRoute>
        }
      />

      {/* Demo routes */}
      <Route
        path="/demo/habit-card"
        element={
          <ProtectedRoute>
            <HabitCardDemo />
          </ProtectedRoute>
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
