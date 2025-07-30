// Competitions API Service
import apiClient, { handleApiError } from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/config/api';
import {
  GetCompetitionsResponse,
  GetCompetitionResponse,
  CompetitionRegistrationRequest,
  CompetitionRegistrationResponse,
  GetCompetitionResultsResponse,
  ListQueryParams,
} from '@/types/api';
import { Competition } from '@/types';

export const competitionsApi = {
  // Get all competitions
  getCompetitions: async (params?: ListQueryParams): Promise<Competition[]> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.COMPETITIONS, { params });
      // According to spec: { success: boolean, message: string, data: { competitions: [], count: number } }
      if (response.data.success && response.data.data && Array.isArray(response.data.data.competitions)) {
        return response.data.data.competitions;
      } else {
        console.error('Unexpected competitions API response:', response.data);
        return [];
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get single competition by ID
  getCompetition: async (id: string): Promise<Competition> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.COMPETITION_DETAIL(id));
      // According to spec: { success: boolean, message: string, data: { competition: Competition } }
      if (response.data.success && response.data.data && response.data.data.competition) {
        return response.data.data.competition;
      } else {
        throw new Error('Competition not found or invalid response format');
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Register for competition
  registerForCompetition: async (
    id: string, 
    registrationData: CompetitionRegistrationRequest
  ): Promise<{ registrationId: string }> => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.COMPETITION_REGISTER(id), 
        registrationData
      );
      // According to spec: { success: boolean, message: string, data: { participant: Participant, competition: {...} } }
      if (response.data.success && response.data.data && response.data.data.participant) {
        return { registrationId: response.data.data.participant.id };
      } else {
        throw new Error('Registration failed or invalid response format');
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get competition results
  getCompetitionResults: async (id: string) => {
    try {
      const response = await apiClient.get<GetCompetitionResultsResponse>(
        API_ENDPOINTS.COMPETITION_RESULTS(id)
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};