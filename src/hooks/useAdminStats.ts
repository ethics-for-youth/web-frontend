// React Query hooks for Admin Stats API
import { useQuery } from '@tanstack/react-query';
import { adminStatsApi, AdminStatsResponse } from '@/services';

// Query keys for admin stats
export const adminStatsQueryKeys = {
  all: ['adminStats'] as const,
  stats: () => [...adminStatsQueryKeys.all, 'stats'] as const,
};

// Hook to fetch admin dashboard statistics
export const useAdminStats = () => {
  return useQuery({
    queryKey: adminStatsQueryKeys.stats(),
    queryFn: () => adminStatsApi.getAdminStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes (stats should be relatively fresh)
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2, // Retry failed requests twice
  });
};