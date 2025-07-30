// Events API Service
import apiClient, { handleApiError } from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/config/api';
import {
  GetEventsResponse,
  GetEventResponse,
  CreateEventRequest,
  CreateEventResponse,
  UpdateEventRequest,
  ListQueryParams,
} from '@/types/api';
import { Event } from '@/types';

export const eventsApi = {
  // Get all events
  getEvents: async (params?: ListQueryParams): Promise<Event[]> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.EVENTS, { params });
      
      // Handle the exact API response structure from OpenAPI spec
      if (API_CONFIG.enableLogging) {
        console.log('Events API Response:', response.data);
      }
      
      // According to OpenAPI spec: { success: boolean, message: string, data: { events: [], count: number } }
      if (response.data.success && response.data.data && Array.isArray(response.data.data.events)) {
        return response.data.data.events;
      } else if (Array.isArray(response.data)) {
        // Fallback for direct array response
        return response.data;
      } else {
        console.error('Unexpected API response structure:', response.data);
        console.error('Expected: { success: true, data: { events: [] } }, but got:', typeof response.data);
        return [];
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get single event by ID
  getEvent: async (id: string): Promise<Event> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.EVENT_DETAIL(id));
      
      // Handle the exact API response structure from OpenAPI spec
      // According to spec: { success: boolean, message: string, data: { event: Event } }
      if (response.data.success && response.data.data && response.data.data.event) {
        return response.data.data.event;
      } else if (response.data.event) {
        return response.data.event;
      } else {
        return response.data;
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Create new event (admin only)
  createEvent: async (eventData: CreateEventRequest): Promise<Event> => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.EVENTS, eventData);
      // According to spec: { success: boolean, message: string, data: { event: Event } }
      if (response.data.success && response.data.data && response.data.data.event) {
        return response.data.data.event;
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Update event (admin only)
  updateEvent: async (id: string, eventData: UpdateEventRequest): Promise<Event> => {
    try {
      const response = await apiClient.put(API_ENDPOINTS.EVENT_DETAIL(id), eventData);
      // According to spec: { success: boolean, message: string, data: { event: Event } }
      if (response.data.success && response.data.data && response.data.data.event) {
        return response.data.data.event;
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Delete event (admin only)
  deleteEvent: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(API_ENDPOINTS.EVENT_DETAIL(id));
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};