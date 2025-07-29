// React Query hooks for Registrations and Volunteers API
import { useMutation } from '@tanstack/react-query';
import { registrationsApi } from '@/services/registrationsApi';
import { volunteersApi } from '@/services';
import { CreateRegistrationRequest, VolunteerJoinRequest } from '@/types/api';
import { toast } from '@/hooks/use-toast';

// Hook to create registration for events/courses
export const useCreateRegistration = () => {
  return useMutation({
    mutationFn: (registrationData: CreateRegistrationRequest) => 
      registrationsApi.createRegistration(registrationData),
    onSuccess: (result) => {
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