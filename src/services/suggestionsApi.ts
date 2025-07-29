// Suggestions API Service
import apiClient, { handleApiError } from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/config/api';
import {
  CreateSuggestionRequest,
  CreateSuggestionResponse,
  GetSuggestionsResponse,
  ListQueryParams,
} from '@/types/api';
import { Suggestion } from '@/types';

export const suggestionsApi = {
  // Submit a suggestion
  createSuggestion: async (suggestionData: CreateSuggestionRequest): Promise<{ suggestionId: string }> => {
    try {
      const response = await apiClient.post<CreateSuggestionResponse>(
        API_ENDPOINTS.SUGGESTIONS, 
        suggestionData
      );
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get all suggestions (admin only - optional)
  getSuggestions: async (params?: ListQueryParams): Promise<Suggestion[]> => {
    try {
      const response = await apiClient.get<GetSuggestionsResponse>(API_ENDPOINTS.SUGGESTIONS, { params });
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};