// Registrations API Service
import apiClient, { handleApiError } from '@/lib/apiClient';
import { API_ENDPOINTS, API_CONFIG } from '@/config/api';
import { transformDynamoDBArray, transformDynamoDBObject, isDynamoDBFormatted } from '@/utils/dynamoDbTransform';

// Registration data types based on your API spec
export interface Registration {
  id: string;
  userId: string;
  itemId: string;
  itemTitle: string,
  itemType: 'event' | 'competition' | 'course';
  userEmail: string;
  userName: string;
  userPhone?: string;
  status: 'registered' | 'cancelled' | 'completed';
  paymentStatus: string,
  notes?: string;
  registeredAt: string;
  updatedAt: string;
}

export interface CreateRegistrationRequest {
  userId: string;
  itemId: string;
  itemType: 'event' | 'competition' | 'course';
  userEmail: string;
  userName: string;
  userPhone?: string;
  notes?: string;
}

export interface UpdateRegistrationRequest {
  status?: 'registered' | 'cancelled' | 'completed';
  notes?: string;
}

export interface RegistrationFilters {
  itemType?: 'event' | 'competition' | 'course';
  itemId?: string;
  title?: string;
  status?: 'registered' | 'completed' | 'cancelled';
  search?: string;
}

export const registrationsApi = {
  // Create registration
  createRegistration: async (registrationData: CreateRegistrationRequest): Promise<{ registrationId: string }> => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.REGISTRATIONS, registrationData);

      if (API_CONFIG.enableLogging) {
        console.log('Registration API Response:', response.data);
      }

      // According to API spec: { success: boolean, message: string, data: { registration: Registration } }
      if (response.data.success && response.data.data && response.data.data.registration) {
        return { registrationId: response.data.data.registration.id };
      } else {
        throw new Error('Registration failed or invalid response format');
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get all registrations with filters
  getRegistrations: async (filters?: RegistrationFilters): Promise<any> => {
    try {
      const params = new URLSearchParams();
      if (filters?.itemType) params.append('itemType', filters.itemType);
      if (filters?.title) params.append('title', filters.title);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);

      const response = await apiClient.get(`${API_ENDPOINTS.REGISTRATIONS}?${params.toString()}`);
      if (API_CONFIG.enableLogging) {
        console.log('Registrations API Response:', response.data);
      }
      let registrations: Registration[] = [];
      // According to API spec: { success: boolean, message: string, data: { registrations: [], count: number } }
      if (response.data.success && response.data.data && Array.isArray(response.data.data.registrations)) {
        registrations = response.data.data;
      } else if (Array.isArray(response.data)) {
        registrations = response.data;
      } else {
        console.error('Unexpected registrations API response:', response.data);
        return [];
      }

      // Transform DynamoDB data if needed
      if (registrations.length > 0 && isDynamoDBFormatted(registrations[0])) {
        if (API_CONFIG.enableLogging) {
          console.log('Transforming DynamoDB formatted registrations data');
        }
        return transformDynamoDBArray(registrations);
      }

      return registrations;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Update registration
  updateRegistration: async (id: string, updateData: UpdateRegistrationRequest): Promise<Registration> => {
    try {
      const response = await apiClient.put(API_ENDPOINTS.REGISTRATION_DETAIL(id), updateData);

      // According to API spec: { success: boolean, message: string, data: { registration: Registration } }
      let registration: Registration;

      if (response.data.success && response.data.data && response.data.data.registration) {
        registration = response.data.data.registration;
      } else {
        throw new Error('Failed to update registration');
      }

      // Transform DynamoDB data if needed
      if (isDynamoDBFormatted(registration)) {
        if (API_CONFIG.enableLogging) {
          console.log('Transforming DynamoDB formatted registration data');
        }
        return transformDynamoDBObject(registration);
      }

      return registration;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};