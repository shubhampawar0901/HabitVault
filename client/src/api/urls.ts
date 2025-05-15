// API endpoint URLs

// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  // REFRESH_TOKEN endpoint removed as we're not using refresh tokens
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  VERIFY_RESET_TOKEN: "/auth/reset-password/verify",
  GET_ME: "/auth/me",
};

// User endpoints
export const USER_ENDPOINTS = {
  PROFILE: "/users/me",
  UPDATE_PROFILE: "/users/me",
  CHANGE_PASSWORD: "/users/change-password",
};

// Habit endpoints
export const HABIT_ENDPOINTS = {
  GET_ALL: "/habits",
  GET_BY_ID: (id: number) => `/habits/${id}`,
  CREATE: "/habits",
  UPDATE: (id: number) => `/habits/${id}`,
  DELETE: (id: number) => `/habits/${id}`,
  GET_CHECKINS: (id: number) => `/habits/${id}/checkins`,
  CREATE_CHECKIN: (id: number) => `/habits/${id}/checkins`,
};

// Checkin endpoints
export const CHECKIN_ENDPOINTS = {
  BATCH_UPDATE: "/checkins/batch",
};

// Analytics endpoints
export const ANALYTICS_ENDPOINTS = {
  SUMMARY: "/analytics/summary",
  HEATMAP: "/analytics/heatmap",
};

// Quote endpoints
export const QUOTE_ENDPOINTS = {
  DAILY: "/quotes/daily",
  RANDOM: "/quotes/random",
  BY_CATEGORY: (category: string) => `/quotes/category/${category}`,
};

// Activity endpoints
export const ACTIVITY_ENDPOINTS = {
  GET_RECENT: "/activities/recent",
  GET_ALL: "/activities",
  GET_BY_TYPE: (type: string) => `/activities/type/${type}`,
};
