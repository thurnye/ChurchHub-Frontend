import axios from 'axios';
import Constants from 'expo-constants';
import apiClient from '@/core/services/apiClient.service';
import type {
  LoginCredentials,
  SignupCredentials,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthResponse,
  User,
} from '../types/auth.types';

const BASE_URL =
  (Constants.expoConfig?.extra?.apiBaseUrl as string | undefined) ?? '';

// Backend wraps responses in { success: true, data: T }
interface ApiResponse<T> {
  success: boolean;
  data: T;
  statusCode: number;
  timestamp: string;
  path: string;
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
  return data.data;
}

export async function signup(credentials: SignupCredentials): Promise<AuthResponse> {
  const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', credentials);
  return data.data;
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout');
}

export async function forgotPassword(request: ForgotPasswordRequest): Promise<{ message: string }> {
  const { data } = await apiClient.post<ApiResponse<{ message: string }>>('/auth/forgot-password', request);
  return data.data;
}

export async function resetPassword(request: ResetPasswordRequest): Promise<{ message: string }> {
  const { data } = await apiClient.post<ApiResponse<{ message: string }>>('/auth/reset-password', request);
  return data.data;
}

export async function getCurrentUser(): Promise<User> {
  const { data } = await apiClient.get<ApiResponse<User>>('/auth/me');
  return data.data;
}

export async function refreshToken(token: string): Promise<{ accessToken: string; refreshToken: string }> {
  // Use plain axios to avoid interceptor loops
  const { data } = await axios.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
    `${BASE_URL}/auth/refresh`,
    { refreshToken: token }
  );
  return data.data;
}
