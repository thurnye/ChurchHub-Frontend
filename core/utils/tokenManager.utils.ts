// shared/utils/tokenManager.ts
import * as SecureStore from 'expo-secure-store';

let accessToken: string | null = null;
let tenantId: string | null = null;

const REFRESH_TOKEN_KEY = 'refresh_token';
const TENANT_ID_KEY = 'tenant_id';

export const tokenManager = {
  // ─── Access token (memory only) ──────────────────────────
  getAccessToken() {
    return accessToken;
  },

  setAccessToken(token: string | null) {
    accessToken = token;
  },

  // ─── Tenant ID (memory + storage for persistence) ─────────
  getTenantId() {
    return tenantId;
  },

  setTenantId(id: string | null) {
    tenantId = id;
  },

  async loadTenantId() {
    tenantId = await SecureStore.getItemAsync(TENANT_ID_KEY);
    return tenantId;
  },

  async saveTenantId(id: string) {
    tenantId = id;
    await SecureStore.setItemAsync(TENANT_ID_KEY, id);
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
    tenantId = null;
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(TENANT_ID_KEY);
  },
};
