// Volunteers API Service
import apiClient, { handleApiError } from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/config/api';
import {
  VolunteerJoinRequest,
  VolunteerJoinResponse,
  GetVolunteersResponse,
  ListQueryParams,
} from '@/types/api';
import { Volunteer } from '@/types';

export const volunteersApi = {
  // Submit volunteer application
  joinAsVolunteer: async (volunteerData: VolunteerJoinRequest): Promise<{ applicationId: string }> => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.VOLUNTEER_JOIN, 
        volunteerData
      );
      // According to spec: { success: boolean, message: string, data: { volunteer: { id, name, email, status, appliedAt } } }
      if (response.data.success && response.data.data && response.data.data.volunteer) {
        return { applicationId: response.data.data.volunteer.id };
      } else {
        throw new Error('Volunteer application failed or invalid response format');
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get all volunteers (admin only - optional)
  getVolunteers: async (params?: ListQueryParams): Promise<Volunteer[]> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.VOLUNTEERS, { params });
      // According to spec: { success: boolean, message: string, data: { volunteers: [], count: number, statusBreakdown: {...} } }
      if (response.data.success && response.data.data && Array.isArray(response.data.data.volunteers)) {
        return response.data.data.volunteers;
      } else {
        console.error('Unexpected volunteers API response:', response.data);
        return [];
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};