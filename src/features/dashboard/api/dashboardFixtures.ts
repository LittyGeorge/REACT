import type { SessionUser } from '../../../types/common';
import type {
  BranchComparison,
  DashboardAppointment,
  DashboardDetails,
  DashboardMetric,
  DashboardMetricKey,
  DashboardOverview,
  DashboardRecord,
  RequestStatus,
  RevenueDay,
} from '../types/dashboard';

interface Branch { id: string; name: string }
interface Customer { id: string; name: string; branchId: string; status: 'Active' | 'Inactive' }
interface ServiceRequest {
  id: string;
  customerId: string;
  branchId: string;
  serviceName: string;
  assignedEmployeeId: string | null;
  status: RequestStatus;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  dueDate: string;
}
interface Employee { id: string; name: string }
interface Invoice { id: string; requestId: string; amountDue: number; balance: number; branchId: string; customerId: string }
interface Payment { id: string; invoiceId: string; branchId: string; amount: number; date: string }
interface Appointment extends DashboardAppointment { requestId: string; customerId: string }

const branches: Branch[] = [
  { id: 'br-north', name: 'North District' },
  { id: 'br-central', name: 'Central Studio' },
  { id: 'br-west', name: 'Westside' },
];

const employees: Employee[] = [
  { id: 'usr-staff-01', name: 'Taylor Reed' },
  { id: 'emp-maya', name: 'Maya Shah' },
  { id: 'emp-leo', name: 'Leo Martins' },
  { id: 'emp-priya', name: 'Priya Nair' },
  { id: 'emp-jamal', name: 'Jamal Okafor' },
  { id: 'emp-zach', name: 'Zach Wong' },
];

const customers: Customer[] = [
  { id: 'cus-1001', name: 'Mira Patel', branchId: 'br-north', status: 'Active' },
  { id: 'cus-1002', name: 'Liam Chen', branchId: 'br-north', status: 'Active' },
  { id: 'cus-1003', name: 'Sofia Williams', branchId: 'br-north', status: 'Active' },
  { id: 'cus-2001', name: 'Oliver Brown', branchId: 'br-central', status: 'Active' },
  { id: 'cus-2002', name: 'Aisha Khan', branchId: 'br-central', status: 'Active' },
  { id: 'cus-2003', name: 'Ethan Davis', branchId: 'br-central', status: 'Inactive' },
  { id: 'cus-3001', name: 'Noah Kim', branchId: 'br-west', status: 'Active' },
  { id: 'cus-3002', name: 'Grace Wilson', branchId: 'br-west', status: 'Active' },
];

function localDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function shiftDate(offset: number): string {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return localDate(date);
}

const requests: ServiceRequest[] = [
  { id: 'SR-2401', customerId: 'cus-1001', branchId: 'br-north', serviceName: 'Heating system inspection', assignedEmployeeId: 'usr-staff-01', status: 'ASSIGNED', priority: 'High', dueDate: shiftDate(1) },
  { id: 'SR-2402', customerId: 'cus-1002', branchId: 'br-north', serviceName: 'Cooling unit maintenance', assignedEmployeeId: 'usr-staff-01', status: 'SCHEDULED', priority: 'Medium', dueDate: shiftDate(0) },
  { id: 'SR-2403', customerId: 'cus-1003', branchId: 'br-north', serviceName: 'Electrical safety check', assignedEmployeeId: 'usr-staff-01', status: 'IN_PROGRESS', priority: 'Urgent', dueDate: shiftDate(-1) },
  { id: 'SR-2404', customerId: 'cus-1001', branchId: 'br-north', serviceName: 'Water heater repair', assignedEmployeeId: null, status: 'NEW', priority: 'Low', dueDate: shiftDate(3) },
  { id: 'SR-2405', customerId: 'cus-1002', branchId: 'br-north', serviceName: 'Appliance installation', assignedEmployeeId: 'usr-staff-01', status: 'ON_HOLD', priority: 'Medium', dueDate: shiftDate(2) },
  { id: 'SR-2406', customerId: 'cus-1003', branchId: 'br-north', serviceName: 'Heating system repair', assignedEmployeeId: 'usr-staff-01', status: 'COMPLETED', priority: 'High', dueDate: shiftDate(-3) },
  { id: 'SR-2407', customerId: 'cus-1001', branchId: 'br-north', serviceName: 'Annual service visit', assignedEmployeeId: 'emp-maya', status: 'COMPLETED', priority: 'Low', dueDate: shiftDate(-5) },
  { id: 'SR-2410', customerId: 'cus-1001', branchId: 'br-north', serviceName: 'Drainage system service', assignedEmployeeId: 'emp-maya', status: 'COMPLETED', priority: 'Medium', dueDate: shiftDate(-7) },
  { id: 'SR-2411', customerId: 'cus-1002', branchId: 'br-north', serviceName: 'Climate control tune-up', assignedEmployeeId: 'emp-leo', status: 'COMPLETED', priority: 'Low', dueDate: shiftDate(-9) },
  { id: 'SR-2412', customerId: 'cus-1003', branchId: 'br-north', serviceName: 'Power system inspection', assignedEmployeeId: 'emp-maya', status: 'COMPLETED', priority: 'Medium', dueDate: shiftDate(-11) },
  { id: 'SR-3401', customerId: 'cus-2001', branchId: 'br-central', serviceName: 'Cooling unit repair', assignedEmployeeId: 'emp-priya', status: 'ASSIGNED', priority: 'Urgent', dueDate: shiftDate(1) },
  { id: 'SR-3402', customerId: 'cus-2002', branchId: 'br-central', serviceName: 'Electrical inspection', assignedEmployeeId: 'emp-priya', status: 'SCHEDULED', priority: 'Medium', dueDate: shiftDate(0) },
  { id: 'SR-3403', customerId: 'cus-2003', branchId: 'br-central', serviceName: 'Generator maintenance', assignedEmployeeId: 'emp-priya', status: 'IN_PROGRESS', priority: 'High', dueDate: shiftDate(0) },
  { id: 'SR-3404', customerId: 'cus-2001', branchId: 'br-central', serviceName: 'Water line repair', assignedEmployeeId: 'emp-jamal', status: 'COMPLETED', priority: 'High', dueDate: shiftDate(-2) },
  { id: 'SR-3410', customerId: 'cus-2001', branchId: 'br-central', serviceName: 'Water pressure inspection', assignedEmployeeId: 'emp-jamal', status: 'COMPLETED', priority: 'Medium', dueDate: shiftDate(-8) },
  { id: 'SR-3411', customerId: 'cus-2002', branchId: 'br-central', serviceName: 'Panel safety inspection', assignedEmployeeId: 'emp-priya', status: 'COMPLETED', priority: 'Low', dueDate: shiftDate(-10) },
  { id: 'SR-4401', customerId: 'cus-3001', branchId: 'br-west', serviceName: 'Seasonal maintenance', assignedEmployeeId: null, status: 'NEW', priority: 'Low', dueDate: shiftDate(4) },
  { id: 'SR-4402', customerId: 'cus-3002', branchId: 'br-west', serviceName: 'Electrical panel service', assignedEmployeeId: 'emp-zach', status: 'ASSIGNED', priority: 'High', dueDate: shiftDate(2) },
  { id: 'SR-4403', customerId: 'cus-3001', branchId: 'br-west', serviceName: 'Heating system inspection', assignedEmployeeId: 'emp-zach', status: 'COMPLETED', priority: 'Medium', dueDate: shiftDate(-4) },
  { id: 'SR-4410', customerId: 'cus-3002', branchId: 'br-west', serviceName: 'Lighting repair', assignedEmployeeId: 'emp-zach', status: 'COMPLETED', priority: 'Low', dueDate: shiftDate(-12) },
  { id: 'SR-4404', customerId: 'cus-3002', branchId: 'br-west', serviceName: 'Cooling unit maintenance', assignedEmployeeId: 'emp-zach', status: 'CLOSED', priority: 'Low', dueDate: shiftDate(-8) },
  { id: 'SR-3405', customerId: 'cus-2002', branchId: 'br-central', serviceName: 'Appliance installation', assignedEmployeeId: 'emp-jamal', status: 'CANCELLED', priority: 'Low', dueDate: shiftDate(-6) },
];

const today = shiftDate(0);
const appointments: Appointment[] = [
  { id: 'AP-801', requestId: 'SR-2402', customerId: 'cus-1002', customerName: 'Liam Chen', serviceName: 'Cooling unit maintenance', employeeName: 'Taylor Reed', date: today, time: '09:30', branchId: 'br-north', status: 'SCHEDULED' },
  { id: 'AP-802', requestId: 'SR-2403', customerId: 'cus-1003', customerName: 'Sofia Williams', serviceName: 'Electrical safety check', employeeName: 'Taylor Reed', date: today, time: '13:00', branchId: 'br-north', status: 'IN_PROGRESS' },
  { id: 'AP-803', requestId: 'SR-3402', customerId: 'cus-2002', customerName: 'Aisha Khan', serviceName: 'Electrical inspection', employeeName: 'Priya Nair', date: today, time: '10:00', branchId: 'br-central', status: 'SCHEDULED' },
  { id: 'AP-804', requestId: 'SR-4402', customerId: 'cus-3002', customerName: 'Grace Wilson', serviceName: 'Electrical panel service', employeeName: 'Zach Wong', date: today, time: '14:30', branchId: 'br-west', status: 'SCHEDULED' },
  { id: 'AP-805', requestId: 'SR-2401', customerId: 'cus-1001', customerName: 'Mira Patel', serviceName: 'Heating system inspection', employeeName: 'Taylor Reed', date: shiftDate(1), time: '11:00', branchId: 'br-north', status: 'SCHEDULED' },
  { id: 'AP-806', requestId: 'SR-3401', customerId: 'cus-2001', customerName: 'Oliver Brown', serviceName: 'Cooling unit repair', employeeName: 'Priya Nair', date: shiftDate(2), time: '15:30', branchId: 'br-central', status: 'SCHEDULED' },
];

const invoices: Invoice[] = [
  { id: 'INV-5001', requestId: 'SR-2410', amountDue: 2_250, balance: 0, branchId: 'br-north', customerId: 'cus-1001' },
  { id: 'INV-5002', requestId: 'SR-2411', amountDue: 1_500, balance: 0, branchId: 'br-north', customerId: 'cus-1002' },
  { id: 'INV-5101', requestId: 'SR-2406', amountDue: 980, balance: 980, branchId: 'br-north', customerId: 'cus-1003' },
  { id: 'INV-5102', requestId: 'SR-2407', amountDue: 1_200, balance: 800, branchId: 'br-north', customerId: 'cus-1001' },
  { id: 'INV-5103', requestId: 'SR-2412', amountDue: 2_100, balance: 0, branchId: 'br-north', customerId: 'cus-1003' },
  { id: 'INV-6202', requestId: 'SR-3410', amountDue: 1_800, balance: 0, branchId: 'br-central', customerId: 'cus-2001' },
  { id: 'INV-6201', requestId: 'SR-3404', amountDue: 760, balance: 760, branchId: 'br-central', customerId: 'cus-2001' },
  { id: 'INV-6203', requestId: 'SR-3411', amountDue: 1_950, balance: 0, branchId: 'br-central', customerId: 'cus-2002' },
  { id: 'INV-7302', requestId: 'SR-4410', amountDue: 1_250, balance: 0, branchId: 'br-west', customerId: 'cus-3002' },
  { id: 'INV-7301', requestId: 'SR-4403', amountDue: 2_200, balance: 1_000, branchId: 'br-west', customerId: 'cus-3001' },
];

const payments: Payment[] = [
  { id: 'PAY-1001', invoiceId: 'INV-5001', branchId: 'br-north', amount: 2_250, date: shiftDate(-1) },
  { id: 'PAY-1002', invoiceId: 'INV-5002', branchId: 'br-north', amount: 1_500, date: shiftDate(-2) },
  { id: 'PAY-1003', invoiceId: 'INV-6202', branchId: 'br-central', amount: 1_800, date: shiftDate(-3) },
  { id: 'PAY-1004', invoiceId: 'INV-7302', branchId: 'br-west', amount: 1_250, date: shiftDate(-4) },
  { id: 'PAY-1005', invoiceId: 'INV-5103', branchId: 'br-north', amount: 2_100, date: shiftDate(-5) },
  { id: 'PAY-1006', invoiceId: 'INV-6203', branchId: 'br-central', amount: 1_950, date: shiftDate(-6) },
];

const statusOptions: Array<{ status: RequestStatus; label: string }> = [
  { status: 'NEW', label: 'New' },
  { status: 'ASSIGNED', label: 'Assigned' },
  { status: 'SCHEDULED', label: 'Scheduled' },
  { status: 'IN_PROGRESS', label: 'In progress' },
  { status: 'ON_HOLD', label: 'On hold' },
  { status: 'COMPLETED', label: 'Completed' },
  { status: 'CLOSED', label: 'Closed' },
  { status: 'CANCELLED', label: 'Cancelled' },
];

const activeStatuses = new Set<RequestStatus>(['NEW', 'ASSIGNED', 'SCHEDULED', 'IN_PROGRESS', 'ON_HOLD']);

function money(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(`${date}T12:00:00`));
}

function scopedData(user: SessionUser) {
  const isStaff = user.role === 'STAFF';
  const branchIds = user.role === 'ADMIN' ? branches.map((branch) => branch.id) : [user.branchId ?? ''];
  const scopedCustomers = customers.filter((customer) => branchIds.includes(customer.branchId));
  const scopedRequests = requests.filter((request) => branchIds.includes(request.branchId) && (!isStaff || request.assignedEmployeeId === user.id));
  const scopedAppointments = appointments.filter((appointment) => branchIds.includes(appointment.branchId) && (!isStaff || appointment.employeeName === user.name));
  const scopedInvoices = invoices.filter((invoice) => branchIds.includes(invoice.branchId) && (!isStaff || scopedRequests.some((request) => request.id === invoice.requestId)));
  const scopedPayments = payments.filter((payment) => branchIds.includes(payment.branchId));
  return { branchIds, scopedCustomers, scopedRequests, scopedAppointments, scopedInvoices, scopedPayments };
}

function recordForRequest(request: ServiceRequest): DashboardRecord {
  const customer = customers.find((candidate) => candidate.id === request.customerId);
  const employee = employees.find((candidate) => candidate.id === request.assignedEmployeeId);
  const branch = branches.find((candidate) => candidate.id === request.branchId);
  const status = statusOptions.find((option) => option.status === request.status)?.label ?? request.status;
  return {
    id: request.id,
    title: request.serviceName,
    subtitle: `${customer?.name ?? 'Customer'} · ${employee ? `Assigned to ${employee.name}` : 'Unassigned'}`,
    status: `${status} · ${request.priority}`,
    date: `Due ${formatDate(request.dueDate)}`,
    branchName: branch?.name,
  };
}

function recordForAppointment(appointment: Appointment): DashboardRecord {
  const branch = branches.find((candidate) => candidate.id === appointment.branchId);
  return {
    id: appointment.id,
    title: appointment.customerName,
    subtitle: `${appointment.serviceName} · ${appointment.employeeName}`,
    status: appointment.status === 'IN_PROGRESS' ? 'In progress' : 'Scheduled',
    date: `${appointment.time} · ${formatDate(appointment.date)}`,
    branchName: branch?.name,
  };
}

function recordForInvoice(invoice: Invoice): DashboardRecord {
  const customer = customers.find((candidate) => candidate.id === invoice.customerId);
  const branch = branches.find((candidate) => candidate.id === invoice.branchId);
  const paid = invoice.amountDue - invoice.balance;
  return {
    id: invoice.id,
    title: customer?.name ?? 'Customer',
    subtitle: `Invoice total ${money(invoice.amountDue)}${paid ? ` · ${money(paid)} received` : ''}`,
    status: paid ? 'Partially paid' : 'Unpaid',
    amount: invoice.balance,
    branchName: branch?.name,
  };
}

function metricsFor(user: SessionUser): DashboardMetric[] {
  const { scopedCustomers, scopedRequests, scopedAppointments, scopedInvoices, scopedPayments } = scopedData(user);
  const activeRequests = scopedRequests.filter((request) => activeStatuses.has(request.status));
  const todayAppointments = scopedAppointments.filter((appointment) => appointment.date === today && appointment.status !== 'CANCELLED');
  const pendingInvoices = scopedInvoices.filter((invoice) => invoice.balance > 0);
  const monthPrefix = today.slice(0, 7);
  const monthPayments = scopedPayments.filter((payment) => payment.date.startsWith(monthPrefix));
  const monthlyRevenue = monthPayments.reduce((sum, payment) => sum + payment.amount, 0);

  if (user.role === 'STAFF') {
    const overdue = activeRequests.filter((request) => request.dueDate < today);
    return [
      { key: 'openRequests', label: 'Open requests', value: activeRequests.length, displayValue: String(activeRequests.length), context: 'Assigned to you', accent: 'teal' },
      { key: 'appointmentsToday', label: 'Appointments today', value: todayAppointments.length, displayValue: String(todayAppointments.length), context: 'On your schedule', accent: 'blue' },
      { key: 'overdueWork', label: 'Overdue work', value: overdue.length, displayValue: String(overdue.length), context: 'Needs your attention', accent: overdue.length ? 'coral' : 'teal' },
      { key: 'personalWorkload', label: 'Personal workload', value: scopedRequests.length, displayValue: String(scopedRequests.length), context: `${activeRequests.length} still open`, accent: 'violet' },
    ];
  }

  const scopeText = user.role === 'ADMIN' ? 'Across all branches' : 'In your branch';
  return [
    { key: 'customers', label: 'Total customers', value: scopedCustomers.length, displayValue: String(scopedCustomers.length), context: scopeText, accent: 'teal' },
    { key: 'activeRequests', label: 'Active requests', value: activeRequests.length, displayValue: String(activeRequests.length), context: 'Need assignment or service', accent: 'blue' },
    { key: 'appointmentsToday', label: "Today's appointments", value: todayAppointments.length, displayValue: String(todayAppointments.length), context: 'Scheduled for today', accent: 'gold' },
    { key: 'pendingPayments', label: 'Pending payments', value: pendingInvoices.length, displayValue: String(pendingInvoices.length), context: money(pendingInvoices.reduce((sum, invoice) => sum + invoice.balance, 0)) + ' outstanding', accent: 'coral' },
    { key: 'monthlyRevenue', label: 'Monthly revenue', value: monthlyRevenue, displayValue: money(monthlyRevenue), context: 'Payments received this month', accent: 'violet' },
  ];
}

export function getDashboardOverview(user: SessionUser): DashboardOverview {
  const { scopedRequests, scopedAppointments, scopedPayments } = scopedData(user);
  const requestStatusBreakdown = statusOptions.map(({ status, label }) => ({
    status,
    label,
    count: scopedRequests.filter((request) => request.status === status).length,
  }));
  const revenueTrend: RevenueDay[] = Array.from({ length: 7 }, (_, index) => {
    const date = shiftDate(index - 6);
    const amount = scopedPayments.filter((payment) => payment.date === date).reduce((sum, payment) => sum + payment.amount, 0);
    return { date, label: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date(`${date}T12:00:00`)), amount };
  });
  const branchComparison: BranchComparison[] = user.role === 'ADMIN'
    ? branches.map((branch) => {
      const branchRequests = requests.filter((request) => request.branchId === branch.id && activeStatuses.has(request.status));
      const branchAppointments = appointments.filter((appointment) => appointment.branchId === branch.id && appointment.date === today && appointment.status !== 'CANCELLED');
      const branchRevenue = scopedPayments.filter((payment) => payment.branchId === branch.id && payment.date.startsWith(today.slice(0, 7))).reduce((sum, payment) => sum + payment.amount, 0);
      return { branchId: branch.id, branchName: branch.name, activeRequests: branchRequests.length, appointmentsToday: branchAppointments.length, monthlyRevenue: branchRevenue };
    })
    : [];
  const branchName = user.branchId ? branches.find((branch) => branch.id === user.branchId)?.name ?? null : null;

  return {
    role: user.role,
    firstName: user.name.split(/\s+/)[0] ?? user.name,
    branchName,
    scopeLabel: user.role === 'ADMIN' ? 'Company-wide view' : user.role === 'BRANCH_MANAGER' ? branchName ?? 'Branch view' : 'Your personal workload',
    generatedAt: new Date().toISOString(),
    metrics: metricsFor(user),
    requestStatusBreakdown,
    revenueTrend,
    branchComparison,
    appointments: scopedAppointments.filter((appointment) => appointment.date >= today && appointment.status !== 'CANCELLED').sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)),
    overdueRequestCount: scopedRequests.filter((request) => activeStatuses.has(request.status) && request.dueDate < today).length,
  };
}

export function getDashboardDetails(user: SessionUser, key: string): DashboardDetails {
  const { branchIds, scopedCustomers, scopedRequests, scopedAppointments, scopedInvoices, scopedPayments } = scopedData(user);
  const statusMatch = key.match(/^status:(NEW|ASSIGNED|SCHEDULED|IN_PROGRESS|ON_HOLD|COMPLETED|CLOSED|CANCELLED)$/);
  const branchMatch = key.match(/^branch:(.+)$/);
  const paymentsDateMatch = key.match(/^payments:(\d{4}-\d{2}-\d{2})$/);
  const metricRecords: Record<DashboardMetricKey, DashboardRecord[]> = {
    customers: scopedCustomers.map((customer) => ({
      id: customer.id,
      title: customer.name,
      subtitle: customer.status === 'Active' ? 'Customer account active' : 'Customer account inactive',
      status: customer.status,
      branchName: branches.find((branch) => branch.id === customer.branchId)?.name,
    })),
    activeRequests: scopedRequests.filter((request) => activeStatuses.has(request.status)).map(recordForRequest),
    appointmentsToday: scopedAppointments.filter((appointment) => appointment.date === today && appointment.status !== 'CANCELLED').map(recordForAppointment),
    pendingPayments: scopedInvoices.filter((invoice) => invoice.balance > 0).map(recordForInvoice),
    monthlyRevenue: scopedPayments.filter((payment) => payment.date.startsWith(today.slice(0, 7))).map((payment) => {
      const invoice = invoices.find((candidate) => candidate.id === payment.invoiceId);
      const customer = invoice ? customers.find((candidate) => candidate.id === invoice.customerId) : undefined;
      return { id: payment.id, title: customer?.name ?? payment.invoiceId, subtitle: `Invoice ${payment.invoiceId}`, status: 'Payment received', date: formatDate(payment.date), amount: payment.amount, branchName: branches.find((branch) => branch.id === payment.branchId)?.name };
    }),
    openRequests: scopedRequests.filter((request) => activeStatuses.has(request.status)).map(recordForRequest),
    overdueWork: scopedRequests.filter((request) => activeStatuses.has(request.status) && request.dueDate < today).map(recordForRequest),
    personalWorkload: scopedRequests.map(recordForRequest),
  };

  if (statusMatch) {
    const status = statusMatch[1] as RequestStatus;
    const label = statusOptions.find((option) => option.status === status)?.label ?? status;
    const records = scopedRequests.filter((request) => request.status === status).map(recordForRequest);
    return { title: `${label} requests`, description: `${records.length} ${records.length === 1 ? 'request' : 'requests'} in this status.`, records };
  }

  if (branchMatch) {
    const branchId = branchMatch[1];
    if (!branchId) return { title: 'Branch details', description: 'This branch could not be found.', records: [] };
    if (user.role !== 'ADMIN' || !branchIds.includes(branchId)) return { title: 'Branch details', description: 'This branch is outside your access scope.', records: [] };
    const branch = branches.find((item) => item.id === branchId);
    const records = requests.filter((request) => request.branchId === branchId && activeStatuses.has(request.status)).map(recordForRequest);
    return { title: branch?.name ?? 'Branch', description: `${records.length} active requests at this branch.`, records };
  }

  if (paymentsDateMatch) {
    const date = paymentsDateMatch[1] ?? '';
    const records = scopedPayments.filter((payment) => payment.date === date).map((payment) => {
      const invoice = invoices.find((candidate) => candidate.id === payment.invoiceId);
      const customer = invoice ? customers.find((candidate) => candidate.id === invoice.customerId) : undefined;
      return { id: payment.id, title: customer?.name ?? payment.invoiceId, subtitle: `Invoice ${payment.invoiceId}`, status: 'Payment received', date: formatDate(payment.date), amount: payment.amount, branchName: branches.find((branch) => branch.id === payment.branchId)?.name };
    });
    return { title: `Payments on ${formatDate(date)}`, description: `${records.length} ${records.length === 1 ? 'payment' : 'payments'} recorded that day.`, records };
  }

  const metricLabels: Record<DashboardMetricKey, string> = {
    customers: 'Customers', activeRequests: 'Active service requests', appointmentsToday: "Today's appointments",
    pendingPayments: 'Pending payments', monthlyRevenue: 'Payments received this month', openRequests: 'Your open requests',
    overdueWork: 'Overdue work', personalWorkload: 'Your assigned requests',
  };
  const metricKey = key as DashboardMetricKey;
  const records = metricKey in metricRecords ? metricRecords[metricKey] : [];
  if (user.role === 'STAFF' && ['customers', 'pendingPayments', 'monthlyRevenue'].includes(metricKey)) {
    return { title: 'Work details', description: 'This metric is outside your role permissions.', records: [] };
  }
  return { title: metricLabels[metricKey] ?? 'Dashboard details', description: `${records.length} ${records.length === 1 ? 'record' : 'records'} in your current view.`, records };
}
