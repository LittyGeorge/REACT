import type { UserRole } from '../../../types/common';

export type RequestStatus = 'NEW' | 'ASSIGNED' | 'SCHEDULED' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CLOSED' | 'CANCELLED';

export type DashboardMetricKey =
  | 'customers'
  | 'activeRequests'
  | 'appointmentsToday'
  | 'pendingPayments'
  | 'monthlyRevenue'
  | 'openRequests'
  | 'overdueWork'
  | 'personalWorkload';

export type DashboardDetailKey = DashboardMetricKey | `status:${RequestStatus}` | `branch:${string}` | `payments:${string}`;

export interface DashboardMetric {
  key: DashboardMetricKey;
  label: string;
  value: number;
  displayValue: string;
  context: string;
  accent: 'teal' | 'gold' | 'blue' | 'coral' | 'violet';
}

export interface RequestStatusCount {
  status: RequestStatus;
  label: string;
  count: number;
}

export interface RevenueDay {
  date: string;
  label: string;
  amount: number;
}

export interface BranchComparison {
  branchId: string;
  branchName: string;
  activeRequests: number;
  appointmentsToday: number;
  monthlyRevenue: number;
}

export interface DashboardAppointment {
  id: string;
  customerName: string;
  serviceName: string;
  employeeName: string;
  date: string;
  time: string;
  branchId: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export interface DashboardRecord {
  id: string;
  title: string;
  subtitle: string;
  status?: string;
  date?: string;
  amount?: number;
  branchName?: string;
}

export interface DashboardDetails {
  title: string;
  description: string;
  records: DashboardRecord[];
}

export interface DashboardOverview {
  role: UserRole;
  firstName: string;
  branchName: string | null;
  scopeLabel: string;
  generatedAt: string;
  metrics: DashboardMetric[];
  requestStatusBreakdown: RequestStatusCount[];
  revenueTrend: RevenueDay[];
  branchComparison: BranchComparison[];
  appointments: DashboardAppointment[];
  overdueRequestCount: number;
}
