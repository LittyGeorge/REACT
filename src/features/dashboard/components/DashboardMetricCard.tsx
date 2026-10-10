import type { DashboardMetric } from '../types/dashboard';

const metricSymbols: Record<DashboardMetric['key'], string> = {
  customers: '◉',
  activeRequests: '↗',
  appointmentsToday: '◷',
  pendingPayments: '$',
  monthlyRevenue: '↗',
  openRequests: '◌',
  overdueWork: '!',
  personalWorkload: '▦',
};

export function DashboardMetricCard({ metric, onOpen }: { metric: DashboardMetric; onOpen: () => void }) {
  return (
    <button className={`dashboard-metric metric-${metric.accent}`} type="button" onClick={onOpen} aria-label={`${metric.label}: ${metric.displayValue}. View details`}>
      <span className="metric-topline"><span>{metric.label}</span><span className="metric-icon" aria-hidden="true">{metricSymbols[metric.key]}</span></span>
      <strong className="metric-value">{metric.displayValue}</strong>
      <span className="metric-context">{metric.context}</span>
      <span className="metric-action">View details <span aria-hidden="true">↗</span></span>
    </button>
  );
}
