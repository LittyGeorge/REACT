import { AxiosError, AxiosHeaders, type AxiosAdapter, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import type { AuthSession, LoginCredentials } from '../features/auth/types/auth';
import { demoAccounts } from '../features/auth/api/demoAccounts';
import { getDashboardDetails, getDashboardOverview } from '../features/dashboard/api/dashboardFixtures';

function response<T>(config: InternalAxiosRequestConfig, data: T, status = 200): AxiosResponse<T> {
  return {
    data,
    status,
    statusText: status === 200 ? 'OK' : 'Not Found',
    headers: new AxiosHeaders(),
    config,
    request: {},
  };
}

function apiError(config: InternalAxiosRequestConfig, status: number, message: string): AxiosError {
  const statusText = status === 401 ? 'Unauthorized' : 'Not Found';
  const errorResponse = response(config, { message }, status);
  errorResponse.statusText = statusText;
  return new AxiosError(message, 'ERR_BAD_REQUEST', config, undefined, errorResponse);
}

function credentialsFrom(config: InternalAxiosRequestConfig): LoginCredentials | null {
  if (typeof config.data !== 'string') return null;

  try {
    const parsed: unknown = JSON.parse(config.data);
    if (typeof parsed !== 'object' || parsed === null) return null;
    const value = parsed as Record<string, unknown>;
    return typeof value.email === 'string' && typeof value.password === 'string'
      ? { email: value.email, password: value.password }
      : null;
  } catch {
    return null;
  }
}

function tokenFrom(config: InternalAxiosRequestConfig): string | null {
  const authorization = config.headers.get('Authorization');
  if (typeof authorization !== 'string' || !authorization.startsWith('Bearer ')) return null;
  return authorization.slice('Bearer '.length);
}

/** Explicit development-only REST adapter. Set VITE_USE_MOCK_API=false to use the real API. */
export const mockApiAdapter: AxiosAdapter = async (config) => {
  const requestUrl = new URL(config.url ?? '/', config.baseURL || 'http://localhost');
  const endpoint = requestUrl.pathname.replace(/\/$/, '');

  if (endpoint === '/auth/login' && config.method === 'post') {
    const credentials = credentialsFrom(config);
    const account = credentials && demoAccounts.find(
      (candidate) => candidate.email === credentials.email && candidate.password === credentials.password,
    );
    if (!account) throw apiError(config, 401, 'Email or password is incorrect.');

    const session: AuthSession = {
      accessToken: `demo-token-${account.user.id}`,
      user: account.user,
    };
    return response(config, session);
  }

  if (endpoint === '/auth/me' && config.method === 'get') {
    const token = tokenFrom(config);
    const account = demoAccounts.find((candidate) => `demo-token-${candidate.user.id}` === token);
    if (!account) throw apiError(config, 401, 'Your session has expired. Please sign in again.');
    return response(config, account.user);
  }

  if (endpoint === '/auth/logout' && config.method === 'post') {
    return response(config, { success: true });
  }

  if (endpoint.startsWith('/dashboard/') && config.method === 'get') {
    const token = tokenFrom(config);
    const account = demoAccounts.find((candidate) => `demo-token-${candidate.user.id}` === token);
    if (!account) throw apiError(config, 401, 'Sign in to load dashboard data.');
    if (endpoint === '/dashboard/overview') return response(config, getDashboardOverview(account.user));
    if (endpoint === '/dashboard/details') {
      const key = requestUrl.searchParams.get('key') ?? '';
      return response(config, getDashboardDetails(account.user, key));
    }
  }

  throw apiError(config, 404, 'This endpoint is not available in the demo API.');
};
