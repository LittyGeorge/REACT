import { useEffect, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useCurrentUser } from '../../features/auth/hooks/useCurrentUser';
import { useAuthStore } from '../../stores/authStore';

export function RequireAuth({ children }: { children: ReactNode }) {
  const location = useLocation();
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const setUser = useAuthStore((state) => state.setUser);
  const clearSession = useAuthStore((state) => state.clearSession);
  const currentUser = useCurrentUser();

  useEffect(() => {
    if (currentUser.data) setUser(currentUser.data);
  }, [currentUser.data, setUser]);

  useEffect(() => {
    if (currentUser.isError) {
      clearSession();
      queryClient.removeQueries({ queryKey: ['auth'] });
    }
  }, [clearSession, currentUser.isError, queryClient]);

  if (!isHydrated) return <SessionLoading />;
  if (!token) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (currentUser.isPending) return <SessionLoading />;
  if (currentUser.isError || !currentUser.data) return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  return children;
}

function SessionLoading() {
  return (
    <main className="session-loading" aria-live="polite" aria-label="Restoring your session">
      <span className="loading-mark">N</span><span className="loading-line" /><span className="loading-copy">Restoring your workspace…</span>
    </main>
  );
}
