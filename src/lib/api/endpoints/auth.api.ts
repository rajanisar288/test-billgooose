import { apiClient } from '@/lib/api/client';

export interface SendCodePayload {
  email: string;
}

export interface VerifyOtpPayload {
  email: string;
  code: string;
}

export const authApi = {
  sendCode: (payload: SendCodePayload) =>
    apiClient.post('/api/v1/customer/auth/send-code', payload),

  verifyCode: (payload: VerifyOtpPayload) =>
    apiClient.post('/api/v1/customer/auth/verify', payload),
};
