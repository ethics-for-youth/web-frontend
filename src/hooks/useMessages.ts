// React Query hooks for Messages API
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagesApi, Message, CreateMessageRequest, MessageFilters } from '@/services';
import { toast } from '@/hooks/use-toast';

// Query keys for messages
export const messagesQueryKeys = {
  all: ['messages'] as const,
  lists: () => [...messagesQueryKeys.all, 'list'] as const,
  list: (filters?: MessageFilters) => [...messagesQueryKeys.lists(), filters ? JSON.stringify(filters) : 'all'] as const,
};

// Hook to fetch messages with filters
export const useMessages = (filters?: MessageFilters) => {
  return useQuery({
    queryKey: messagesQueryKeys.list(filters),
    queryFn: () => messagesApi.getMessages(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes (messages may be more dynamic)
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

// Hook to submit a message
export const useCreateMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageData: CreateMessageRequest) => messagesApi.createMessage(messageData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messagesQueryKeys.lists() });
      toast({
        title: "Message Sent Successfully!",
        description: "Thank you for your message. We'll review it and get back to you if needed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Send Message",
        description: error.message || "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    },
  });
};