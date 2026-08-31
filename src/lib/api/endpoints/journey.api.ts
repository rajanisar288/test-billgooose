import { Journey } from '@/interfaces/shared';
import { apiClient } from '@/lib/api/client';

export const journeyApi = {
  getJourney: (journeyId: string) => apiClient.get(`/api/v1/journeys/${journeyId}`),

  // Create a Journey
  createJourney: (payload: Journey) => apiClient.post('/api/v1/journeys', payload),

  // update a Journey
  updateJourney: (journeyId: string, payload: {}) =>
    apiClient.put(`/api/v1/journeys/${journeyId}/customer`, payload),

  getAddress: (journeyId: string, params?: { postcode?: string; source?: number }) => {
    return apiClient.get(`/api/v1/journeys/${journeyId}/addresses`, {
      params: params,
    });
  },
};
