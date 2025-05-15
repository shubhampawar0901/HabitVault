import axios from 'axios';
import { setupInterceptors } from './interceptors';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Setup request/response interceptors
setupInterceptors(api);

export default api;
