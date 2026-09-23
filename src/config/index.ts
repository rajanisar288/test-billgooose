export const config = {
  api: {
    // baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.example.com/v1',
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://uat-api.billgoose.com',
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000', 10),
    retryAttempts: parseInt(process.env.NEXT_PUBLIC_API_RETRY_ATTEMPTS || '3', 10),
    retryDelay: parseInt(process.env.NEXT_PUBLIC_API_RETRY_DELAY || '1000', 10),
  },

  caching: {
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  },

  pagination: {
    defaultPage: 1,
    defaultLimit: 20,
  },

  gtm: {
    id: process.env.NEXT_PUBLIC_GTM_ID || '',
  },
} as const;
