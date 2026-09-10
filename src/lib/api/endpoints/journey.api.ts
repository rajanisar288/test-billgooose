import { type Journey } from '@/interfaces/shared';
import { apiClient } from '@/lib/api/client';

export const journeyApi = {
  getServiceTypes: () => apiClient.get('/api/v1/service-types'),

  getServiceTypeFields: (serviceTypeId: number) =>
    apiClient.get('/api/v1/service-types/fields', { params: { serviceTypeId } }),

  getJourney: (journeyId: string) => apiClient.get(`/api/v1/journeys/${journeyId}`),

  // Create a Journey
  createJourney: (payload: Journey) => apiClient.post('/api/v1/journeys', payload),

  // Check Consumption (energy service)
  prepareConsumption: (journeyId: string, payload: { forceRefresh: boolean }) =>
    apiClient.post(`/api/v1/journeys/${journeyId}/consumption/prepare`, payload),

  // Get Quote
  getQuote: (journeyId: string, payload: {}) =>
    apiClient.post(`/api/v1/journeys/${journeyId}/quotes`, payload),

  // update a Journey
  updateJourney: (journeyId: string, payload: {}) =>
    apiClient.put(`/api/v1/journeys/${journeyId}/customer`, payload),

  getAddress: (journeyId: string, params?: { postcode?: string; source?: number }) => {
    return apiClient.get(`/api/v1/journeys/${journeyId}/addresses`, {
      params: params,
    });
  },

  // Create a Journey Order
  createJourneyOrder: (
    journeyId: string,
    payload: { quoteId: string; productReferences: string[] },
  ) => apiClient.post(`/api/v1/journeys/${journeyId}/orders`, payload),

  // Submit Journey Order Bank Details
  submitJourneyOrderBankDetails: (
    journeyId: string,
    orderId: string,
    payload: {
      accountHolderName: string;
      bankNameOrBuildingSociety: string;
      accountNumber: string;
      sortCode: string;
      directDebitConsentAccepted: boolean;
    },
  ) => apiClient.post(`/api/v1/journeys/${journeyId}/orders/${orderId}/bank-details`, payload),
};
