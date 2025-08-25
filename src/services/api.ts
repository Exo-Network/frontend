import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// API endpoints
export const apiEndpoints = {
  groundStations: '/ground-stations',
  satellites: '/satellites',
  satelliteTle: '/satellites/tle',
};

// Ground Stations API
export const groundStationsApi = {
  getAll: async () => {
    const response = await api.get(apiEndpoints.groundStations);
    return response.data;
  },
};

// Satellites API
export const satellitesApi = {
  getAll: async () => {
    const response = await api.get(apiEndpoints.satellites);
    return response.data;
  },
  getAllTle: async () => {
    const response = await api.get(apiEndpoints.satelliteTle);
    return response.data;
  },
};

export default api;
