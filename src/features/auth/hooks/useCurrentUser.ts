import { useQuery } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../../../stores/authStore';

export const currentUserQueryKey = (token: string | null) => ['auth', 'me', token] as const;

export function useCurrentUser() {
  const token = useAuthStore((state) => state.token);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  return useQuery({
    queryKey: currentUserQueryKey(token),
    queryFn: authApi.currentUser,
    enabled: isHydrated && Boolean(token),
    retry: false,
    staleTime: 5 * 60_000,
  });
}
