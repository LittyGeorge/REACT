import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { hasAnyPermission, type Permission } from '../../lib/permissions';
import { useCurrentUser } from '../../features/auth/hooks/useCurrentUser';

export function RequirePermission({ children, permissions }: { children: ReactNode; permissions: readonly Permission[] }) {
  const user = useAuthStore((state) => state.user);
  const currentUser = useCurrentUser();
  const verifiedUser = currentUser.data ?? user;
  if (!hasAnyPermission(verifiedUser?.role, permissions)) return <Navigate to="/access-denied" replace />;
  return children;
}
