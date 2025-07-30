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
      
      // Handle different possible response structures
      if (API_CONFIG.enableLogging) {
        console.log('Events API Response:', response.data);
      }
      
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else if (response.data.events && Array.isArray(response.data.events)) {
        return response.data.events;
      } else {
        console.error('Unexpected API response structure:', response.data);
        console.error('Expected an array of events, but got:', typeof response.data);
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
      
      // Handle different possible response structures
      if (response.data.data) {
        return response.data.data;
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
      const response = await apiClient.post<CreateEventResponse>(API_ENDPOINTS.EVENTS, eventData);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Update event (admin only)
  updateEvent: async (id: string, eventData: UpdateEventRequest): Promise<Event> => {
    try {
      const response = await apiClient.put<CreateEventResponse>(API_ENDPOINTS.EVENT_DETAIL(id), eventData);
      return response.data.data;
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