// API Configuration for Ethics For Youth Platform

// Base API URL - uses environment variable with fallback
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://d4ca8ryveb.execute-api.ap-south-1.amazonaws.com/default';

// API Endpoints
export const API_ENDPOINTS = {
  // Events
  EVENTS: '/events',
  EVENT_DETAIL: (id: string) => `/events/${id}`,
  
  // Competitions
  COMPETITIONS: '/competitions',
  COMPETITION_DETAIL: (id: string) => `/competitions/${id}`,
  COMPETITION_REGISTER: (id: string) => `/competitions/${id}/register`,
  COMPETITION_RESULTS: (id: string) => `/competitions/${id}/results`,
  
  // Volunteers
  VOLUNTEER_JOIN: '/volunteers/join',
  VOLUNTEERS: '/volunteers',
  
  // Suggestions
  SUGGESTIONS: '/suggestions',
} as const;

// API Configuration
export const API_CONFIG = {
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'), // Default 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  enableLogging: import.meta.env.VITE_API_LOGGING === 'true',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;