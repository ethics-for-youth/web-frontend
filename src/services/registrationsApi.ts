// Registrations API Service
import apiClient, { handleApiError } from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/config/api';
import {
  CreateRegistrationRequest,
  CreateRegistrationResponse,
} from '@/types/api';

// Note: This assumes there's a registrations endpoint for events/courses
// If not, we'll need to update based on actual API structure
export const registrationsApi = {
  // Create registration for event or course
  createRegistration: async (registrationData: CreateRegistrationRequest): Promise<{ registrationId: string }> => {
    try {
      // For now using a generic /registrations endpoint
      // This may need to be updated based on actual API structure
      const response = await apiClient.post<CreateRegistrationResponse>(
        '/registrations', 
        registrationData
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};