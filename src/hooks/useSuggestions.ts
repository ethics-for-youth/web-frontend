// React Query hooks for Suggestions API
import { useMutation } from '@tanstack/react-query';
import { suggestionsApi } from '@/services';
import { CreateSuggestionRequest } from '@/types/api';
import { toast } from '@/hooks/use-toast';

// Hook to submit suggestion
export const useCreateSuggestion = () => {
  return useMutation({
    mutationFn: (suggestionData: CreateSuggestionRequest) => 
      suggestionsApi.createSuggestion(suggestionData),
    onSuccess: (result) => {
      toast({
        title: "Suggestion Submitted!",
        description: `Thank you for your suggestion. We appreciate your feedback and will review it carefully. Suggestion ID: ${result.suggestionId}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};