// React Query hooks for Events API
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsApi } from '@/services';
import { Event } from '@/types';
import { ListQueryParams, CreateEventRequest, UpdateEventRequest } from '@/types/api';
import { toast } from '@/hooks/use-toast';

// Query keys for React Query cache management
export const eventsQueryKeys = {
  all: ['events'] as const,
  lists: () => [...eventsQueryKeys.all, 'list'] as const,
  list: (params?: ListQueryParams) => [...eventsQueryKeys.lists(), params ? JSON.stringify(params) : 'all'] as const,
  details: () => [...eventsQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...eventsQueryKeys.details(), id] as const,
};

// Hook to fetch all events
export const useEvents = (params?: ListQueryParams) => {
  return useQuery({
    queryKey: eventsQueryKeys.list(params),
    queryFn: () => eventsApi.getEvents(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (updated from cacheTime)
    refetchOnWindowFocus: false, // Prevents unnecessary refetches
    refetchOnMount: false, // Only refetch if data is stale
  });
};

// Hook to fetch single event
export const useEvent = (id: string) => {
  return useQuery({
    queryKey: eventsQueryKeys.detail(id),
    queryFn: () => eventsApi.getEvent(id),
    enabled: !!id, // Only run query if id exists
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000, // Updated from cacheTime
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

// Hook to create new event (admin only)
export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (eventData: CreateEventRequest) => eventsApi.createEvent(eventData),
    onSuccess: (newEvent: Event) => {
      // Invalidate and refetch events list
      queryClient.invalidateQueries({ queryKey: eventsQueryKeys.lists() });
      
      toast({
        title: "Event Created",
        description: `${newEvent.title} has been successfully created.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Create Event",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Hook to update event (admin only)
export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, eventData }: { id: string; eventData: UpdateEventRequest }) =>
      eventsApi.updateEvent(id, eventData),
    onSuccess: (updatedEvent: Event) => {
      // Invalidate and refetch events list and detail
      queryClient.invalidateQueries({ queryKey: eventsQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventsQueryKeys.detail(updatedEvent.id) });
      
      toast({
        title: "Event Updated",
        description: `${updatedEvent.title} has been successfully updated.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Update Event",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Hook to delete event (admin only)
export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => eventsApi.deleteEvent(id),
    onSuccess: () => {
      // Invalidate and refetch events list
      queryClient.invalidateQueries({ queryKey: eventsQueryKeys.lists() });
      
      toast({
        title: "Event Deleted",
        description: "Event has been successfully deleted.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Delete Event",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};