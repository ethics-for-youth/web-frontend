// Volunteers API Service
import apiClient, { handleApiError } from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/config/api';
import {
  VolunteerJoinRequest,
  ListQueryParams,
  UpdateVolunteerRequest,
} from '@/types/api';
import { Volunteer } from '@/types';

export interface VolunteersListResponse {
  volunteers: Volunteer[];
  count: number;
  statusBreakdown?: {
    pending?: number;
    approved?: number;
    active?: number;
    inactive?: number;
  };
}

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
  getVolunteers: async (params?: ListQueryParams): Promise<VolunteersListResponse> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.VOLUNTEERS, { params });
      // According to spec: { success: boolean, message: string, data: { volunteers: [], count: number, statusBreakdown: {...} } }
      if (response.data.success && response.data.data) {
        const data = response.data.data;
        return {
          volunteers: Array.isArray(data.volunteers) ? data.volunteers : [],
          count: data.count ?? 0,
          statusBreakdown: data.statusBreakdown,
        };
      } else {
        console.error('Unexpected volunteers API response:', response.data);
        return { volunteers: [], count: 0 };
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Update volunteer status (admin only)
  updateVolunteer: async (id: string, updateData: UpdateVolunteerRequest): Promise<Volunteer> => {
    try {
      const response = await apiClient.put(API_ENDPOINTS.VOLUNTEER_DETAIL(id), updateData);
      if (response.data.success && response.data.data && response.data.data.volunteer) {
        return response.data.data.volunteer;
      } else {
        throw new Error('Failed to update volunteer');
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};