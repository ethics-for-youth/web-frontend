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
      const response = await apiClient.post(
        API_ENDPOINTS.SUGGESTIONS, 
        suggestionData
      );
      // According to spec: { success: boolean, message: string, data: { suggestion: { id, title, category, submitterName, status, submittedAt } } }
      if (response.data.success && response.data.data && response.data.data.suggestion) {
        return { suggestionId: response.data.data.suggestion.id };
      } else {
        throw new Error('Suggestion submission failed or invalid response format');
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get all suggestions (admin only - optional)
  getSuggestions: async (params?: ListQueryParams): Promise<Suggestion[]> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.SUGGESTIONS, { params });
      // According to spec: { success: boolean, message: string, data: { suggestions: [], count: number, categoryBreakdown: {...}, statusBreakdown: {...} } }
      if (response.data.success && response.data.data && Array.isArray(response.data.data.suggestions)) {
        return response.data.data.suggestions;
      } else {
        console.error('Unexpected suggestions API response:', response.data);
        return [];
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};