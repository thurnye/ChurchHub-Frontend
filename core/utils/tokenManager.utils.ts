// shared/utils/tokenManager.ts
import * as SecureStore from 'expo-secure-store';

let accessToken: string | null = null;

const REFRESH_TOKEN_KEY = 'refresh_token';

export const tokenManager = {
  // ─── Access token (memory only) ──────────────────────────
  getAccessToken() {
    return accessToken;
  },

  setAccessToken(token: string | null) {
    accessToken = token;
  },

  // ─── Refresh token (secure storage) ──────────────────────
  async getRefreshToken() {
    return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  },

  async setRefreshToken(token: string) {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  },

  async clear() {
    accessToken = null;
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  },
};
