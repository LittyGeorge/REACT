import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RequireAuth } from './guards/RequireAuth';
import { RequirePermission } from './guards/RequirePermission';
import { AppShell } from '../components/layout/AppShell';
import { useAuthStore } from '../stores/authStore';
import { dashboardPathForRole, type Permission } from '../lib/permissions';
import { useCurrentUser } from '../features/auth/hooks/useCurrentUser';

const DashboardPage = lazy(() => import('../features/dashboard/pages/DashboardPage').then((module) => ({ default: module.DashboardPage })));
const NotFoundPage = lazy(() => import('../features/dashboard/pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })));
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage').then((module) => ({ default: module.LoginPage })));
const AccessDeniedPage = lazy(() => import('../features/auth/pages/AccessDeniedPage').then((module) => ({ default: module.AccessDeniedPage })));
const dashboardPermissions = ['dashboard.read.company', 'dashboard.read.branch', 'dashboard.read.personal'] as const;

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/workspace" replace />,
  },
  {
    path: '/login',
    element: <LoginRoute />,
  },
  {
    path: '/access-denied',
    element: <Suspense fallback={<RouteLoading />}><AccessDeniedPage /></Suspense>,
  },
  {
    path: '/workspace',
    element: <RequireAuth><AppShell /></RequireAuth>,
    children: [
      { index: true, element: <RoleDashboardRedirect /> },
      { path: 'admin', element: <DashboardPermissionRoute permissions={[dashboardPermissions[0]]} /> },
      { path: 'branch', element: <DashboardPermissionRoute permissions={[dashboardPermissions[1]]} /> },
      { path: 'staff', element: <DashboardPermissionRoute permissions={[dashboardPermissions[2]]} /> },
      { path: '*', element: <Suspense fallback={<RouteLoading />}><NotFoundPage /></Suspense> },
    ],
  },
  {
    path: '*',
    element: <Suspense fallback={<RouteLoading />}><NotFoundPage /></Suspense>,
  },
]);

function LoginRoute() {
  const token = useAuthStore((state) => state.token);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  if (!isHydrated) return <div className="session-loading" aria-label="Preparing sign in"><span className="loading-mark">N</span></div>;
  return token ? <Navigate to="/workspace" replace /> : <Suspense fallback={<RouteLoading />}><LoginPage /></Suspense>;
}

function RoleDashboardRedirect() {
  const { data: user } = useCurrentUser();
  return user ? <Navigate to={dashboardPathForRole(user.role)} replace /> : <Navigate to="/login" replace />;
}

function DashboardPermissionRoute({ permissions }: { permissions: readonly Permission[] }) {
  return (
    <RequirePermission permissions={permissions}>
      <Suspense fallback={<RouteLoading />}><DashboardPage /></Suspense>
    </RequirePermission>
  );
}

function RouteLoading() {
  return <main className="session-loading" aria-live="polite"><span className="loading-mark">N</span><span className="loading-line" /><span className="loading-copy">Opening your workspace…</span></main>;
}
