import axios from 'axios';
import { mockApiAdapter } from './mockApiAdapter';
import { useAuthStore } from '../stores/authStore';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15_000,
});

if (import.meta.env.VITE_USE_MOCK_API !== 'false') {
  apiClient.defaults.adapter = mockApiAdapter;
}

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});
