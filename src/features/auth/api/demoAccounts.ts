import type { LoginCredentials } from '../types/auth';
import type { SessionUser } from '../../../types/common';

export interface DemoAccount extends LoginCredentials {
  label: string;
  user: SessionUser;
}

export const demoAccounts: DemoAccount[] = [
  {
    label: 'Administrator',
    email: 'admin@northstar.demo',
    password: 'Admin123!',
    user: { id: 'usr-admin-01', name: 'Avery Morgan', email: 'admin@northstar.demo', role: 'ADMIN', branchId: null },
  },
  {
    label: 'Branch manager',
    email: 'manager@northstar.demo',
    password: 'Manager123!',
    user: { id: 'usr-manager-01', name: 'Jordan Lee', email: 'manager@northstar.demo', role: 'BRANCH_MANAGER', branchId: 'br-north' },
  },
  {
    label: 'Staff member',
    email: 'staff@northstar.demo',
    password: 'Staff123!',
    user: { id: 'usr-staff-01', name: 'Taylor Reed', email: 'staff@northstar.demo', role: 'STAFF', branchId: 'br-north' },
  },
];
