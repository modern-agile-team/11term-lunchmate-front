import axios, { type InternalAxiosRequestConfig } from 'axios';
import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  isAuthenticated,
  setAuthTokens,
} from '@/shared/lib/auth/session';

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _skipAuthRefresh?: boolean;
}

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 10000,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.set('Authorization', `Bearer ${accessToken}`);
  } else {
    config.headers.delete('Authorization');
  }

  return config;
});

let refreshPromise: Promise<boolean> | null = null;

async function refreshSession(): Promise<boolean> {
  const refreshToken = getRefreshToken();

  try {
    const response = await client.post(
      '/api/v1/auth/refresh',
      refreshToken ? { refreshToken } : undefined,
      { _skipAuthRefresh: true } as RetryableRequestConfig,
    );

    const data = response.data as { accessToken?: string; refreshToken?: string } | null;
    if (data?.accessToken && data?.refreshToken) {
      setAuthTokens(data.accessToken, data.refreshToken);
    }

    return true;
  } catch {
    return false;
  }
}

client.interceptors.response.use(
  (response) => {
    if (
      response.data &&
      typeof response.data === 'object' &&
      'data' in response.data &&
      'statusCode' in response.data
    ) {
      response.data = response.data.data;
    }

    return response;
  },
  async (error) => {
    const config = error.config as RetryableRequestConfig | undefined;
    const shouldAttemptRefresh =
      error.response?.status === 401 &&
      config &&
      !config._skipAuthRefresh &&
      !config._retry &&
      isAuthenticated();

    if (!shouldAttemptRefresh) {
      if (error.response?.status === 401) {
        clearAuthSession();
      }

      return Promise.reject(error);
    }

    config._retry = true;

    if (!refreshPromise) {
      refreshPromise = refreshSession().finally(() => {
        refreshPromise = null;
      });
    }

    const refreshed = await refreshPromise;

    if (!refreshed) {
      clearAuthSession();
      return Promise.reject(error);
    }

    return client(config);
  },
);

export default client;
