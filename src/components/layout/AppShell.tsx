import { NavLink, Outlet } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useUiStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';
import { authApi } from '../../features/auth/api/authApi';
import { dashboardPathForRole, roleLabel } from '../../lib/permissions';

const plannedModules = ['Customers', 'Service requests', 'Appointments', 'Services', 'Invoices'];

export function AppShell() {
  const isMobileNavigationOpen = useUiStore((state) => state.isMobileNavigationOpen);
  const toggleMobileNavigation = useUiStore((state) => state.toggleMobileNavigation);
  const closeMobileNavigation = useUiStore((state) => state.closeMobileNavigation);
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const logout = useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      clearSession();
      queryClient.clear();
      navigate('/login', { replace: true });
    },
  });
  const initials = user?.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase() ?? 'U';

  return (
    <div className={`app-frame${isMobileNavigationOpen ? ' sidebar-open' : ''}`}>
      <aside className="sidebar" aria-label="Main navigation">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">N</span>
          <span className="brand-name">northstar<span>operations</span></span>
        </div>

        <div className="workspace-switcher">
          <span className="workspace-icon" aria-hidden="true">N</span>
          <span className="workspace-copy"><strong>Northstar Services</strong><small>Company workspace</small></span>
          <span className="switcher-chevron" aria-hidden="true">⌄</span>
        </div>

        <p className="nav-label">WORKSPACE</p>
        <nav className="primary-nav">
          <NavLink to={user ? dashboardPathForRole(user.role) : '/workspace'} end aria-label="Overview" onClick={closeMobileNavigation} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            <NavIcon kind="overview" />
            <span>Overview</span>
          </NavLink>
          {plannedModules.map((module) => (
            <div className="nav-item planned" key={module} aria-disabled="true" title="Available in a later project phase">
              <NavIcon kind={module === 'Customers' ? 'people' : module === 'Appointments' ? 'calendar' : 'work'} />
              <span>{module}</span>
              <span className="planned-dot" aria-label="Coming in a later phase" />
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="help-card">
            <span className="help-icon" aria-hidden="true">?</span>
            <div><strong>Building your workspace</strong><p>More tools arrive as each phase is completed.</p></div>
          </div>
          <div className="profile-row">
            <span className="profile-avatar">{initials}</span>
            <span className="profile-copy"><strong>{user?.name ?? 'Workspace user'}</strong><small>{user ? roleLabel(user.role) : 'Signed in'}</small></span>
            <span className="profile-more" aria-hidden="true">···</span>
          </div>
        </div>
      </aside>

      <div className="main-column">
        <header className="topbar">
          <button className="mobile-menu-button" type="button" aria-label={isMobileNavigationOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={isMobileNavigationOpen} onClick={toggleMobileNavigation}>
            <span /><span /><span />
          </button>
          <div className="breadcrumb"><span>Workspace</span><span className="breadcrumb-slash">/</span><strong>Overview</strong></div>
          <div className="topbar-actions">
            <span className="phase-pill"><span /> Access protected</span>
            <span className="icon-button" aria-hidden="true">?</span>
            <button className="logout-button" type="button" onClick={() => logout.mutate()} disabled={logout.isPending}>
              {logout.isPending ? 'Signing out…' : 'Sign out'}
            </button>
            <span className="top-avatar" aria-label={user?.name ?? 'Signed in user'}>{initials}</span>
          </div>
        </header>
        <main className="page-content"><Outlet /></main>
        <footer className="page-footer"><span>Northstar Operations</span><span>Service management, all in one place.</span></footer>
      </div>
    </div>
  );
}

function NavIcon({ kind }: { kind: 'overview' | 'people' | 'calendar' | 'work' }) {
  if (kind === 'overview') {
    return <svg className="nav-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="3" y="3" width="5" height="5" rx="1" /><rect x="12" y="3" width="5" height="5" rx="1" /><rect x="3" y="12" width="5" height="5" rx="1" /><rect x="12" y="12" width="5" height="5" rx="1" /></svg>;
  }
  if (kind === 'people') {
    return <svg className="nav-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="8" cy="7" r="3" /><path d="M2.8 16c.5-2.5 2.2-3.8 5.2-3.8s4.7 1.3 5.2 3.8M13 4.4a3 3 0 0 1 0 5.2m1.3 2.6c1.7.5 2.7 1.8 2.9 3.8" /></svg>;
  }
  if (kind === 'calendar') {
    return <svg className="nav-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="3" y="4.5" width="14" height="12" rx="2" /><path d="M6.5 3v3M13.5 3v3M3 8h14" /></svg>;
  }
  return <svg className="nav-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="3" y="4" width="14" height="12" rx="2" /><path d="M6.5 8h7M6.5 11h4" /></svg>;
}
