import { useQuery } from '@tanstack/react-query';
import { Trip } from '@/types';

// Fetch all trips
export const useTrips = () => {
  return useQuery<Trip[]>({
    queryKey: ['trips'],
    queryFn: async () => {
      const response = await fetch('/api/trips');
      if (!response.ok) {
        throw new Error('Failed to fetch trips');
      }
      return response.json();
    },
  });
};

// Fetch a single trip by ID
export const useTrip = (id: string) => {
  return useQuery<Trip>({
    queryKey: ['trip', id],
    queryFn: async () => {
      const response = await fetch(`/api/trips/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch trip');
      }
      return response.json();
    },
    enabled: !!id,
  });
};