import axios, { AxiosError, type AxiosInstance } from 'axios';
import Constants from 'expo-constants';
import { tokenManager } from '../utils/tokenManager.utils';

// ─── Base URL ───────────────────────────────────────────────

const BASE_URL =
  (Constants.expoConfig?.extra?.apiBaseUrl as string | undefined) ?? '';

// ─── Axios Instance ─────────────────────────────────────────

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request interceptor – attach access token ─────────────

apiClient.interceptors.request.use(
  (config) => {
    const token = tokenManager.getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry
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
        const refreshToken = await tokenManager.getRefreshToken();

        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const { data } = await axios.post(
          `${BASE_URL}/auth/refresh`,
          { refreshToken }
        );

        const newAccessToken = data.accessToken;

        tokenManager.setAccessToken(newAccessToken);
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
