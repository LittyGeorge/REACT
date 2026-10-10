import { apiClient } from '../../../lib/axios';
import type { DashboardDetailKey, DashboardDetails, DashboardOverview } from '../types/dashboard';

export const dashboardApi = {
  async getOverview(): Promise<DashboardOverview> {
    const response = await apiClient.get<DashboardOverview>('/dashboard/overview');
    return response.data;
  },

  async getDetails(key: DashboardDetailKey): Promise<DashboardDetails> {
    const response = await apiClient.get<DashboardDetails>('/dashboard/details', { params: { key } });
    return response.data;
  },
};
