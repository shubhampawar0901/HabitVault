import { useState, useEffect, useCallback } from "react";
import { authService } from "../services/authService";
import type {
  LoginRequest,
  RegisterRequest,
  User,
} from "../interfaces/auth.interface";
import { showToast } from "../components/common/Toast";
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize user from localStorage
  useEffect(() => {
    try {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.error("Error loading user from localStorage:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Login function
  const login = useCallback(async (credentials: LoginRequest) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Login failed";
      setError(errorMessage);

      // Don't show toast for validation errors - they're displayed in the form
      if (!err.response?.data?.errors) {
        showToast.error(errorMessage);
      }

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Register function
  const register = useCallback(async (userData: RegisterRequest) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.register(userData);
      setUser(response.user);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      setError(errorMessage);

      // Don't show toast for validation errors - they're displayed in the form
      if (!err.response?.data?.errors) {
        showToast.error(errorMessage);
      }

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    setLoading(true);

    try {
      await authService.logout();
      setUser(null);
      showToast.success("Logged out successfully");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Logout failed";
      console.error("Logout error:", err);
      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
};
