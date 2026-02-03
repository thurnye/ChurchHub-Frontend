import apiClient from '@/core/services/apiClient.service';
import type { ApiResponse } from '@/core/types/api.types';
import type {
  LoginCredentials,
  SignupCredentials,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthResponse,
  User,
} from '../types/auth.types';

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
  return data.data;
}

export async function signup(credentials: SignupCredentials): Promise<AuthResponse> {
  const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/signup', credentials);
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

export async function refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
  const { data } = await apiClient.post<ApiResponse<{ accessToken: string }>>('/auth/refresh', { refreshToken });
  return data.data;
}
