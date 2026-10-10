import type { UserRole } from '../types/common';

export type Permission =
  | 'dashboard.read.company' | 'dashboard.read.branch' | 'dashboard.read.personal'
  | 'customers.read.all' | 'customers.read.branch' | 'customers.read.assigned' | 'customers.write.all' | 'customers.write.branch' | 'customers.add-note'
  | 'serviceRequests.read.all' | 'serviceRequests.read.branch' | 'serviceRequests.read.assigned' | 'serviceRequests.assign.all' | 'serviceRequests.assign.branch' | 'serviceRequests.close.all' | 'serviceRequests.close.branch' | 'serviceRequests.update-assigned'
  | 'appointments.manage.all' | 'appointments.manage.branch' | 'appointments.read.assigned' | 'appointments.request-reschedule'
  | 'employees.manage' | 'employees.read.branch' | 'employees.assign.branch'
  | 'branches.manage' | 'branches.read.own'
  | 'services.manage' | 'services.read.all' | 'services.read.branch' | 'services.read.assigned'
  | 'invoices.manage.all' | 'invoices.manage.branch' | 'invoices.read.assigned'
  | 'payments.manage.all' | 'payments.manage.branch'
  | 'notifications.read.own' | 'activity.read.all' | 'activity.read.branch' | 'activity.read.assigned';

const permissionsByRole: Record<UserRole, readonly Permission[]> = {
  ADMIN: [
    'dashboard.read.company', 'customers.read.all', 'customers.write.all',
    'serviceRequests.read.all', 'serviceRequests.assign.all', 'serviceRequests.close.all',
    'appointments.manage.all', 'employees.manage', 'branches.manage',
    'services.manage', 'services.read.all', 'invoices.manage.all', 'payments.manage.all',
    'notifications.read.own', 'activity.read.all',
  ],
  BRANCH_MANAGER: [
    'dashboard.read.branch', 'customers.read.branch', 'customers.write.branch',
    'serviceRequests.read.branch', 'serviceRequests.assign.branch', 'serviceRequests.close.branch',
    'appointments.manage.branch', 'employees.read.branch', 'employees.assign.branch',
    'branches.read.own', 'services.read.branch', 'invoices.manage.branch', 'payments.manage.branch',
    'notifications.read.own', 'activity.read.branch',
  ],
  STAFF: [
    'dashboard.read.personal', 'customers.read.assigned', 'customers.add-note',
    'serviceRequests.read.assigned', 'serviceRequests.update-assigned',
    'appointments.read.assigned', 'appointments.request-reschedule', 'invoices.read.assigned',
    'services.read.assigned', 'notifications.read.own', 'activity.read.assigned',
  ],
};

export function hasPermission(role: UserRole | null | undefined, permission: Permission): boolean {
  return role ? permissionsByRole[role].includes(permission) : false;
}

export function hasAnyPermission(role: UserRole | null | undefined, permissions: readonly Permission[]): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}

export function roleLabel(role: UserRole): string {
  switch (role) {
    case 'ADMIN': return 'Administrator';
    case 'BRANCH_MANAGER': return 'Branch manager';
    case 'STAFF': return 'Staff member';
  }
}

export function dashboardPathForRole(role: UserRole): string {
  switch (role) {
    case 'ADMIN': return '/workspace/admin';
    case 'BRANCH_MANAGER': return '/workspace/branch';
    case 'STAFF': return '/workspace/staff';
  }
}
