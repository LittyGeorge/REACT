export type UserRole = 'ADMIN' | 'BRANCH_MANAGER' | 'STAFF';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  branchId: string | null;
}
