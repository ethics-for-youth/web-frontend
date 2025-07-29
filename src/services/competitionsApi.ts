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
      const response = await apiClient.get<GetCompetitionsResponse>(API_ENDPOINTS.COMPETITIONS, { params });
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get single competition by ID
  getCompetition: async (id: string): Promise<Competition> => {
    try {
      const response = await apiClient.get<GetCompetitionResponse>(API_ENDPOINTS.COMPETITION_DETAIL(id));
      return response.data.data;
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
      const response = await apiClient.post<CompetitionRegistrationResponse>(
        API_ENDPOINTS.COMPETITION_REGISTER(id), 
        registrationData
      );
      return response.data.data;
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