import type { SessionUser } from '../../../types/common';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthSession {
  accessToken: string;
  user: SessionUser;
}
