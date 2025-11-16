import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, API_CONFIG } from '@/config/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available (for future admin features)
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (API_CONFIG.enableLogging) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data || config.params);
    }
    return config;
  },
  (error: AxiosError) => {
    if (API_CONFIG.enableLogging) {
      console.error('❌ Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (API_CONFIG.enableLogging) {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error: AxiosError) => {
    if (API_CONFIG.enableLogging) {
      console.error('❌ Response Error:', error.response?.status, error.response?.data || error.message);
    }
    
    // Handle common error scenarios
    if (error.response?.status === 401) {
      // Unauthorized - clear auth token and redirect to login
      localStorage.removeItem('auth_token');
      // Could dispatch logout action here
    }
    
    return Promise.reject(error);
  }
);

// Helper function to handle API errors consistently
// ✅ MORE SPECIFIC:
export const handleApiError = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message;
        
        // Specific error messages by status
        switch (status) {
            case 400:
                return message || 'Invalid request. Please check your input.';
            case 401:
                return 'Authentication required. Please log in.';
            case 403:
                return 'You don\'t have permission to perform this action.';
            case 404:
                return 'The requested resource was not found.';
            case 500:
                return 'Server error. Please try again later.';
            default:
                return message || error.message || 'An unexpected error occurred';
        }
    }
    return 'An unexpected error occurred';
};

export default apiClient;