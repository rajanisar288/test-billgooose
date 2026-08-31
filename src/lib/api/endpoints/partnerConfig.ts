import { apiClient } from '@/lib/api/client';

export const partnerConfigApi = {
  getConfig: () => apiClient.get(`/api/v1/partner/configuration`),
};
