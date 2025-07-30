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
      // Note: This endpoint is not in the OpenAPI spec yet
      // Using a generic /registrations endpoint - may need updating
      const response = await apiClient.post(
        '/registrations', 
        registrationData
      );
      
      // Assuming similar structure to other endpoints
      if (response.data.success && response.data.data) {
        return { registrationId: response.data.data.registrationId || response.data.data.id };
      } else {
        throw new Error('Registration failed or invalid response format');
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};