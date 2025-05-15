import api from '../api/axios';
import { AUTH_ENDPOINTS } from '../api/urls';
import type { LoginRequest, AuthResponse, RegisterRequest, User } from '../interfaces/auth.interface';
import type { AxiosResponse } from 'axios';
import { showToast } from '../components/common/Toast';

export const authService = {
  /**
   * Login user
   * @param credentials - User login credentials
   * @returns Promise with user data and token
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post(AUTH_ENDPOINTS.LOGIN, credentials);

    console.log('Login response:', response.data);

    // Store token and user in localStorage
    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Show success toast
      showToast.success('Login successful');
    }

    return response.data;
  },

  /**
   * Register new user
   * @param userData - User registration data
   * @returns Promise with user data and token
   */
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post(AUTH_ENDPOINTS.REGISTER, userData);

    console.log('Register response:', response.data);

    // Store token and user in localStorage
    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Show success toast
      showToast.success('Registration successful');
    }

    return response.data;
  },

  /**
   * Logout user
   * @returns Promise with logout status
   */
  logout: async (): Promise<void> => {
    try {
      console.log('Attempting to logout...');

      const response = await api.post(AUTH_ENDPOINTS.LOGOUT, {});

      console.log('Logout response:', response.data);
      showToast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      showToast.error('Error during logout');
    } finally {
      // Clear localStorage regardless of API response
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Force redirect to login page
      window.location.href = '/login';
    }
  },

  /**
   * Get current authenticated user
   * @returns User object or null
   */
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr) as User;
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        return null;
      }
    }
    return null;
  },

  /**
   * Check if user is authenticated
   * @returns boolean
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
};
