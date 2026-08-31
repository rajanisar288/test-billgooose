import { config } from '@/config';
import { log } from '@/utils/logger';
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

interface ApiErrorResponse {
  error?: string;
  message?: string;
  details?: Record<string, string[]>;
  statusCode?: number;
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.api.baseUrl,
      timeout: config.api.timeout,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'api-key': 'bg_live_09bba36587072647ada743cb0af313a9',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      this.handleRequest.bind(this),
      this.handleRequestError.bind(this),
    );

    this.client.interceptors.response.use(
      this.handleResponse.bind(this),
      this.handleResponseError.bind(this),
    );
  }

  private handleRequest(config: InternalAxiosRequestConfig) {
    // Add API key if available
    if (process.env.NEXT_PUBLIC_API_KEY) {
      delete config.headers['api-key'];
      delete config.headers['Api-Key'];
      delete config.headers['API-Key'];
      delete config.headers['API_KEY'];

      // Set the header as-is
      config.headers['api-key'] = process.env.NEXT_PUBLIC_API_KEY;
    }

    // Add language header if available
    if (typeof window !== 'undefined') {
      const lang = localStorage.getItem('language') || 'en';
      config.headers['Accept-Language'] = lang;
    }

    // Log request
    // apiLogger.request(config.method?.toUpperCase() || 'GET', config.url || '', config.data);

    return config;
  }

  private handleRequestError(error: AxiosError) {
    log.error('Request interceptor error:', error);
    return Promise.reject(error);
  }

  private handleResponse(response: any) {
    // Log response
    // apiLogger.response(
    //   response.config.method?.toUpperCase() || 'GET',
    //   response.config.url || '',
    //   response.status,
    //   response.data,
    // );

    return response;
  }

  private handleResponseError(error: AxiosError<ApiErrorResponse>) {
    if (error.response) {
      // Server responded with error status
      const errorData = {
        status: error.response.status,
        message: error.response.data?.error || error.response.data?.message || 'An error occurred',
        details: error.response.data?.details,
        data: error.response.data,
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
      };

      // // Log error
      // apiLogger.error(
      //   error.config?.method?.toUpperCase() || 'GET',
      //   error.config?.url || '',
      //   errorData,
      // );

      return Promise.reject(errorData);
    }

    if (error.request) {
      // Request made but no response
      const errorData = {
        status: 0,
        message: 'No response from server. Please check your connection.',
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
      };

      log.error('Network error:', errorData);
      return Promise.reject(errorData);
    }

    // Request setup error
    const errorData = {
      status: 0,
      message: error.message || 'Request failed',
    };

    log.error('Request setup error:', errorData);
    return Promise.reject(errorData);
  }

  public getClient() {
    return this.client;
  }
}

export const apiClient = new ApiClient().getClient();
