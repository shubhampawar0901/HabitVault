import { AxiosError, type AxiosInstance, type AxiosResponse } from "axios";
import { showToast } from "../components/common/Toast";
import type { ApiError } from "../interfaces/error.interface";

/**
 * Setup axios interceptors for request and response handling
 * @param api - Axios instance
 */
export function setupInterceptors(api: AxiosInstance): void {
  // Request interceptor
  api.interceptors.request.use(
    (config) => {
      // Add auth token if available
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      console.error("Request error:", error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  api.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError<ApiError>) => {
      // Handle common errors (401, 403, etc.)
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        // Handle specific status codes
        switch (status) {
          case 400: // Bad Request
            if (data.errors && Object.keys(data.errors).length > 0) {
              // Don't show toast for validation errors - let the form handle them
              console.error("Validation errors:", data.errors);
            } else {
              showToast.error(data.message || "Invalid request");
            }
            break;

          case 401: // Unauthorized
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            showToast.error(data.message || "Authentication required");

            // Redirect to login if not already there
            if (window.location.pathname !== "/login") {
              window.location.href = "/login";
            }
            break;

          case 403: // Forbidden
            showToast.error(
              data.message ||
                "You do not have permission to access this resource"
            );
            break;

          case 404: // Not Found
            showToast.error(data.message || "Resource not found");
            break;

          case 409: // Conflict
            showToast.error(data.message || "Resource conflict");
            break;

          case 500: // Server Error
          case 502: // Bad Gateway
          case 503: // Service Unavailable
            showToast.error(
              data.message || "Server error, please try again later"
            );
            break;

          default:
            showToast.error(data.message || "An unexpected error occurred");
            break;
        }
      } else if (error.request) {
        // The request was made but no response was received
        // showToast.error("Network error, please check your connection");
      } else {
        // Something happened in setting up the request
        // showToast.error("An error occurred while processing your request");
      }

      return Promise.reject(error);
    }
  );
}
