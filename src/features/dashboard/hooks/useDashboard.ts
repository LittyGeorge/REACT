import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../../stores/authStore';
import { dashboardApi } from '../api/dashboardApi';
import type { DashboardDetailKey } from '../types/dashboard';

export function useDashboard() {
  const user = useAuthStore((state) => state.user);
  return useQuery({
    queryKey: ['dashboard', 'overview', user?.id, user?.role, user?.branchId],
    queryFn: dashboardApi.getOverview,
    enabled: Boolean(user),
    staleTime: 60_000,
  });
}

export function useDashboardDetails(key: DashboardDetailKey | null) {
  const user = useAuthStore((state) => state.user);
  return useQuery({
    queryKey: ['dashboard', 'details', user?.id, key],
    queryFn: () => {
      if (!key) throw new Error('A dashboard detail key is required.');
      return dashboardApi.getDetails(key);
    },
    enabled: Boolean(user && key),
    staleTime: 60_000,
  });
}
