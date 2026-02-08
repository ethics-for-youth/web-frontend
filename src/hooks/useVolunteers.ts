// React Query hooks for Volunteers API (admin)
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { volunteersApi } from '@/services';
import { UpdateVolunteerRequest } from '@/types/api';
import { toast } from '@/hooks/use-toast';

export interface VolunteerFilters {
  status?: 'pending' | 'approved' | 'active' | 'inactive';
  search?: string;
}

// Query keys for volunteers
export const volunteersQueryKeys = {
  all: ['volunteers'] as const,
  lists: () => [...volunteersQueryKeys.all, 'list'] as const,
  list: (filters?: VolunteerFilters) =>
    [...volunteersQueryKeys.lists(), filters ? JSON.stringify(filters) : 'all'] as const,
};

// Hook to fetch volunteers
export const useVolunteers = (filters?: VolunteerFilters) => {
  return useQuery({
    queryKey: volunteersQueryKeys.list(filters),
    queryFn: () =>
      volunteersApi.getVolunteers({
        status: filters?.status,
        search: filters?.search,
      }),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

// Hook to update volunteer status
export const useUpdateVolunteer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updateData }: { id: string; updateData: UpdateVolunteerRequest }) =>
      volunteersApi.updateVolunteer(id, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: volunteersQueryKeys.lists() });
      toast({
        title: 'Volunteer Updated',
        description: 'The volunteer has been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
