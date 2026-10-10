import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { currentUserQueryKey } from './useCurrentUser';
import { useAuthStore } from '../../../stores/authStore';

export function useLogin() {
  const queryClient = useQueryClient();
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (session) => {
      setSession(session);
      queryClient.setQueryData(currentUserQueryKey(session.accessToken), session.user);
    },
  });
}
