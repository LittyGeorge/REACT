import type { SessionUser } from '../../../types/common';
import { apiClient } from '../../../lib/axios';
import type { AuthSession, LoginCredentials } from '../types/auth';

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const response = await apiClient.post<AuthSession>('/auth/login', credentials);
    return response.data;
  },

  async currentUser(): Promise<SessionUser> {
    const response = await apiClient.get<SessionUser>('/auth/me');
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },
};
