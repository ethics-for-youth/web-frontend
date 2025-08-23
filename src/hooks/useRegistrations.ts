// React Query hooks for Registrations and Volunteers API
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { registrationsApi, volunteersApi } from '@/services';
import {
  Registration,
  NewCreateRegistrationRequest,
  UpdateRegistrationRequest,
  RegistrationFilters
} from '@/services';
import { VolunteerJoinRequest } from '@/types/api';
import { toast } from '@/hooks/use-toast';

// Query keys for registrations
export const registrationsQueryKeys = {
  all: ['registrations'] as const,
  lists: () => [...registrationsQueryKeys.all, 'list'] as const,
  list: (filters?: RegistrationFilters) => [...registrationsQueryKeys.lists(), filters ? JSON.stringify(filters) : 'all'] as const,
};

// Hook to fetch registrations with filters
export const useRegistrations = (filters?: RegistrationFilters) => {
  return useQuery({
    queryKey: registrationsQueryKeys.list(filters),
    queryFn: () => registrationsApi.getRegistrations(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

// Hook to create registration for events/courses
export const useCreateRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (registrationData: NewCreateRegistrationRequest) =>
      registrationsApi.createRegistration(registrationData),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: registrationsQueryKeys.lists() });
      toast({
        title: "Registration Successful!",
        description: `Thank you for registering. We'll contact you soon with further details. Registration ID: ${result.registrationId}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Hook to update registration status
export const useUpdateRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updateData }: { id: string; updateData: UpdateRegistrationRequest }) =>
      registrationsApi.updateRegistration(id, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: registrationsQueryKeys.lists() });
      toast({
        title: "Registration Updated",
        description: "The registration has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Hook to submit volunteer application
export const useVolunteerApplication = () => {
  return useMutation({
    mutationFn: (volunteerData: VolunteerJoinRequest) =>
      volunteersApi.joinAsVolunteer(volunteerData),
    onSuccess: (result) => {
      toast({
        title: "Application Submitted!",
        description: `Thank you for your interest in volunteering. We'll review your application and get back to you soon. Application ID: ${result.applicationId}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Application Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};