import axios, { AxiosError, type AxiosInstance } from 'axios';
import Constants from 'expo-constants';
import { tokenManager } from '../utils/tokenManager.utils';

// ─── Base URL ───────────────────────────────────────────────

const BASE_URL =
  (Constants.expoConfig?.extra?.apiBaseUrl as string | undefined) || 'http://localhost:3000/api/v1';

// Debug: Log the base URL on load
console.log('[apiClient] BASE_URL:', BASE_URL);

// ─── Axios Instance ─────────────────────────────────────────

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request interceptor – attach access token and tenant ID ─────────────

apiClient.interceptors.request.use(
  (config) => {
    const token = tokenManager.getAccessToken();
    const tenantId = tokenManager.getTenantId();

    console.log('[apiClient] Request:', config.method?.toUpperCase(), config.url);
    console.log('[apiClient] Token present:', !!token, 'TenantId:', tenantId);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (tenantId) {
      config.headers['x-tenant-id'] = tenantId;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Refresh handling state ─────────────────────────────────

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else if (token) p.resolve(token);
  });
  failedQueue = [];
};

// ─── Response interceptor – handle 401 + refresh ───────────

// Endpoints that should NOT trigger token refresh (to prevent infinite loops)
const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'];

apiClient.interceptors.response.use(
  (response) => {
    console.log('[apiClient] Response:', response.status, response.config.url);
    return response;
  },
  async (error: AxiosError) => {
    console.log('[apiClient] Error:', error.response?.status, error.config?.url, error.message);
    const originalRequest = error.config as any;
    const requestUrl = originalRequest?.url || '';

    // Skip refresh logic for auth endpoints to prevent infinite loops
    const isAuthEndpoint = AUTH_ENDPOINTS.some(endpoint => requestUrl.includes(endpoint));

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Queue request until refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(apiClient(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        const storedRefreshToken = await tokenManager.getRefreshToken();

        if (!storedRefreshToken) {
          throw new Error('No refresh token');
        }

        const { data } = await axios.post(
          `${BASE_URL}/auth/refresh`,
          { refreshToken: storedRefreshToken }
        );

        // Backend wraps response in { success: true, data: { accessToken, refreshToken } }
        const responseData = data.data || data;
        const newAccessToken = responseData.accessToken;
        const newRefreshToken = responseData.refreshToken;

        tokenManager.setAccessToken(newAccessToken);
        if (newRefreshToken) {
          await tokenManager.setRefreshToken(newRefreshToken);
        }
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        await tokenManager.clear();

        // Trigger logout in auth store
        // Note: Dynamic import to avoid circular dependency
        import('@/shared/stores/stores').then(({ store }) => {
          import('@/features/auth/redux/slices/auth.slice').then(({ logoutUser }) => {
            store.dispatch(logoutUser());
          });
        });

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
