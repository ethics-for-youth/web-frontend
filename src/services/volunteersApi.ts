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
      const response = await apiClient.post<VolunteerJoinResponse>(
        API_ENDPOINTS.VOLUNTEER_JOIN, 
        volunteerData
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get all volunteers (admin only - optional)
  getVolunteers: async (params?: ListQueryParams): Promise<Volunteer[]> => {
    try {
      const response = await apiClient.get<GetVolunteersResponse>(API_ENDPOINTS.VOLUNTEERS, { params });
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};