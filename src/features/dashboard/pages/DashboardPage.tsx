import { useCallback, useState } from 'react';
import { useAuthStore } from '../../../stores/authStore';
import { roleLabel } from '../../../lib/permissions';
import { DashboardMetricCard } from '../components/DashboardMetricCard';
import { DashboardDetailsDialog } from '../components/DashboardDetailsDialog';
import { useDashboard } from '../hooks/useDashboard';
import type { DashboardDetailKey, DashboardOverview, RequestStatus } from '../types/dashboard';

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const dashboard = useDashboard();
  const [selectedDetail, setSelectedDetail] = useState<DashboardDetailKey | null>(null);
  const closeDetails = useCallback(() => setSelectedDetail(null), []);
  const firstName = user?.name.split(/\s+/)[0] ?? 'there';

  if (dashboard.isPending) return <DashboardLoading />;
  if (dashboard.isError || !dashboard.data) {
    return <DashboardError onRetry={() => void dashboard.refetch()} />;
  }

  const data = dashboard.data;
  const isStaff = data.role === 'STAFF';
  const now = new Date();
  const greeting = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(now);
  const timeGreeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="dashboard-page">
      <div className="dashboard-heading-row">
        <div>
          <p className="eyebrow"><span className="eyebrow-line" /> {roleLabel(data.role).toUpperCase()} · {data.scopeLabel.toUpperCase()}</p>
          <h1>{timeGreeting}, {firstName}.</h1>
          <p className="dashboard-subtitle">Here’s what’s happening across your service operations.</p>
        </div>
        <div className="dashboard-date"><span className="date-icon" aria-hidden="true">◷</span><span><small>TODAY</small><strong>{greeting}</strong></span></div>
      </div>

      <section className={`dashboard-metrics${isStaff ? ' staff-metrics' : ''}`} aria-label="Operational metrics">
        {data.metrics.map((metric) => <DashboardMetricCard key={metric.key} metric={metric} onOpen={() => setSelectedDetail(metric.key)} />)}
      </section>

      <section className={`dashboard-panels${isStaff ? ' staff-panels' : ''}`}>
        <StatusBreakdown data={data} onOpen={(status) => setSelectedDetail(`status:${status}`)} />
        {isStaff ? (
          <WorkQueue data={data} onOpen={(key) => setSelectedDetail(key)} />
        ) : (
          <RevenueTrend data={data} onOpen={(date) => setSelectedDetail(`payments:${date}`)} />
        )}
      </section>

      {data.role === 'ADMIN' ? (
        <BranchComparison data={data} onOpen={(branchId) => setSelectedDetail(`branch:${branchId}`)} />
      ) : (
        <AppointmentSchedule data={data} onOpen={() => setSelectedDetail('appointmentsToday')} />
      )}

      <div className="dashboard-data-note"><span className="demo-indicator" />{import.meta.env.VITE_USE_MOCK_API !== 'false' ? 'Demo data · Metrics reflect the included sample records.' : 'Live data · Refreshed from your service API.'}<span className="data-updated">Updated {new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date(data.generatedAt))}</span></div>
      <DashboardDetailsDialog detailKey={selectedDetail} onClose={closeDetails} />
    </div>
  );
}

function StatusBreakdown({ data, onOpen }: { data: DashboardOverview; onOpen: (status: RequestStatus) => void }) {
  const maxCount = Math.max(1, ...data.requestStatusBreakdown.map((item) => item.count));
  return (
    <section className="dashboard-panel status-panel" aria-labelledby="status-heading">
      <PanelHeading id="status-heading" eyebrow={data.role === 'STAFF' ? 'YOUR WORKLOAD' : 'SERVICE OPERATIONS'} title={data.role === 'STAFF' ? 'Requests by status' : 'Request status'} subtitle="Select a status to inspect its requests." />
      <div className="status-bars">
        {data.requestStatusBreakdown.filter((item) => data.role !== 'STAFF' || ['ASSIGNED', 'SCHEDULED', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED'].includes(item.status)).map((item) => (
          <button className={`status-bar-row status-${item.status.toLowerCase()}`} type="button" key={item.status} onClick={() => onOpen(item.status)} aria-label={`${item.label}: ${item.count} requests. View details`}>
            <span className="status-label"><i />{item.label}</span>
            <span className="status-bar-track"><span style={{ width: `${item.count ? Math.max(5, item.count / maxCount * 100) : 0}%` }} /></span>
            <strong>{item.count}</strong>
          </button>
        ))}
      </div>
      <div className="panel-footnote"><span className="status-total">{data.requestStatusBreakdown.reduce((sum, item) => sum + item.count, 0)} requests in scope</span><span>All statuses</span></div>
    </section>
  );
}

function RevenueTrend({ data, onOpen }: { data: DashboardOverview; onOpen: (date: string) => void }) {
  const max = Math.max(1, ...data.revenueTrend.map((day) => day.amount));
  const total = data.revenueTrend.reduce((sum, day) => sum + day.amount, 0);
  return (
    <section className="dashboard-panel revenue-panel" aria-labelledby="revenue-heading">
      <PanelHeading id="revenue-heading" eyebrow="PAYMENTS RECEIVED" title="Recent revenue" subtitle="Recorded payments over the last seven days." />
      <div className="revenue-summary"><strong>{money.format(total)}</strong><span>Last 7 days</span></div>
      <div className="revenue-chart" aria-label={`Payments received over seven days, totaling ${money.format(total)}`}>
        {data.revenueTrend.map((day) => (
          <button className="revenue-day" key={day.date} type="button" onClick={() => onOpen(day.date)} aria-label={`${day.label}: ${money.format(day.amount)} received. View payments`}>
            <span className="revenue-amount">{day.amount ? money.format(day.amount) : '$0'}</span>
            <div className="revenue-column"><span style={{ height: `${day.amount ? Math.max(8, day.amount / max * 100) : 3}%` }} /></div>
            <span className="revenue-label">{day.label}</span>
          </button>
        ))}
      </div>
      <p className="chart-caption">Select a day to view the payments recorded.</p>
    </section>
  );
}

function BranchComparison({ data, onOpen }: { data: DashboardOverview; onOpen: (branchId: string) => void }) {
  const maxActive = Math.max(1, ...data.branchComparison.map((branch) => branch.activeRequests));
  return (
    <section className="dashboard-panel branch-panel" aria-labelledby="branch-heading">
      <PanelHeading id="branch-heading" eyebrow="COMPANY-WIDE VIEW" title="Branch comparison" subtitle="Current activity and month-to-date payments by branch." />
      <div className="branch-table-wrap">
        <table className="branch-table">
          <thead><tr><th>Branch</th><th>Active requests</th><th>Appointments today</th><th>Monthly revenue</th><th><span className="visually-hidden">Branch details</span></th></tr></thead>
          <tbody>
            {data.branchComparison.map((branch) => (
              <tr key={branch.branchId}>
                <td><span className="branch-avatar">{branch.branchName.slice(0, 1)}</span><strong>{branch.branchName}</strong></td>
                <td><span className="branch-count"><span style={{ width: `${branch.activeRequests ? Math.max(8, branch.activeRequests / maxActive * 100) : 0}%` }} />{branch.activeRequests}</span></td>
                <td>{branch.appointmentsToday}</td>
                <td className="branch-revenue">{money.format(branch.monthlyRevenue)}</td>
                <td><button className="row-open" type="button" onClick={() => onOpen(branch.branchId)} aria-label={`View ${branch.branchName} request details`}>↗</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="panel-footnote"><span>{data.branchComparison.length} active branch locations</span><span>View branch requests ↗</span></div>
    </section>
  );
}

function WorkQueue({ data, onOpen }: { data: DashboardOverview; onOpen: (key: DashboardDetailKey) => void }) {
  const overdueMetric = data.metrics.find((metric) => metric.key === 'overdueWork');
  const openMetric = data.metrics.find((metric) => metric.key === 'openRequests');
  return (
    <section className="dashboard-panel work-queue-panel" aria-labelledby="queue-heading">
      <PanelHeading id="queue-heading" eyebrow="YOUR NEXT STEPS" title="Work needing attention" subtitle="Prioritize overdue work and active requests." />
      <button className="queue-action queue-overdue" type="button" onClick={() => onOpen('overdueWork')}>
        <span className="queue-icon">!</span><span><strong>Overdue work</strong><small>Past its due date</small></span><b>{overdueMetric?.displayValue ?? '0'}</b><span className="queue-arrow">↗</span>
      </button>
      <button className="queue-action" type="button" onClick={() => onOpen('openRequests')}>
        <span className="queue-icon queue-icon-teal">↗</span><span><strong>Open requests</strong><small>Assigned to you</small></span><b>{openMetric?.displayValue ?? '0'}</b><span className="queue-arrow">↗</span>
      </button>
      <p className="work-queue-note">Your workload includes {data.metrics.find((metric) => metric.key === 'personalWorkload')?.displayValue ?? '0'} assigned requests in total.</p>
    </section>
  );
}

function AppointmentSchedule({ data, onOpen }: { data: DashboardOverview; onOpen: () => void }) {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const todayAppointments = data.appointments.filter((appointment) => appointment.date === today);
  const visibleAppointments = todayAppointments.slice(0, 4);
  return (
    <section className="dashboard-panel schedule-panel" aria-labelledby="schedule-heading">
      <div className="schedule-heading-row"><PanelHeading id="schedule-heading" eyebrow={data.role === 'STAFF' ? 'YOUR CALENDAR' : 'BRANCH SCHEDULE'} title={data.role === 'STAFF' ? 'Today’s appointments' : 'Today at your branch'} subtitle={data.branchName ?? 'Scheduled service visits'} /><button type="button" className="schedule-view-all" onClick={onOpen}>View all ↗</button></div>
      {visibleAppointments.length ? (
        <div className="schedule-list">
          {visibleAppointments.map((appointment) => (
            <article className="schedule-item" key={appointment.id}>
              <time>{appointment.time}</time><span className="schedule-rule" /><div className="schedule-info"><strong>{appointment.customerName}</strong><span>{appointment.serviceName}</span></div><span className={`appointment-state state-${appointment.status.toLowerCase()}`}>{appointment.status === 'IN_PROGRESS' ? 'In progress' : 'Scheduled'}</span>
            </article>
          ))}
        </div>
      ) : <div className="schedule-empty">No appointments scheduled for today.</div>}
    </section>
  );
}

function PanelHeading({ id, eyebrow, title, subtitle }: { id: string; eyebrow: string; title: string; subtitle: string }) {
  return <div className="panel-heading dashboard-panel-heading"><div><p className="eyebrow">{eyebrow}</p><h2 id={id}>{title}</h2><p className="panel-subtitle">{subtitle}</p></div></div>;
}

function DashboardLoading() {
  return <div className="dashboard-page" aria-live="polite" aria-label="Loading dashboard">
    <div className="dashboard-heading-skeleton"><span /><span /></div>
    <div className="metric-skeleton-grid">{Array.from({ length: 5 }, (_, index) => <div className="metric-skeleton" key={index} />)}</div>
    <div className="panel-skeleton-grid"><div className="panel-skeleton" /><div className="panel-skeleton" /></div>
  </div>;
}

function DashboardError({ onRetry }: { onRetry: () => void }) {
  return <section className="dashboard-error" role="alert"><span className="error-mark">!</span><h1>We couldn’t load your dashboard.</h1><p>Your workspace data may be temporarily unavailable. Try again in a moment.</p><button className="primary-button" type="button" onClick={onRetry}>Retry</button></section>;
}
