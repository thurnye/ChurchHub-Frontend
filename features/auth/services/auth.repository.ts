import { DATA_SOURCE } from '@/shared/utils/dataSource';
import type {
  LoginCredentials,
  SignupCredentials,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthResponse,
  User,
} from '../types/auth.types';
import * as authApi from './auth.api.service';

function delay<T>(value: T, ms = 500): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

// Mock user for testing
const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
  createdAt: new Date().toISOString(),
};

const mockAuthResponse: AuthResponse = {
  user: mockUser,
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
};

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  if (DATA_SOURCE === 'api') return authApi.login(credentials);

  // Mock validation
  if (credentials.email && credentials.password) {
    return delay(mockAuthResponse);
  }
  throw new Error('Invalid credentials');
}

export async function signup(credentials: SignupCredentials): Promise<AuthResponse> {
  if (DATA_SOURCE === 'api') return authApi.signup(credentials);

  // Mock validation
  if (credentials.email && credentials.password && credentials.name) {
    return delay({
      ...mockAuthResponse,
      user: { ...mockUser, name: credentials.name, email: credentials.email },
    });
  }
  throw new Error('Invalid signup data');
}

export async function logout(): Promise<void> {
  if (DATA_SOURCE === 'api') return authApi.logout();
  return delay(undefined);
}

export async function forgotPassword(request: ForgotPasswordRequest): Promise<{ message: string }> {
  if (DATA_SOURCE === 'api') return authApi.forgotPassword(request);
  return delay({ message: 'Password reset email sent successfully' });
}

export async function resetPassword(request: ResetPasswordRequest): Promise<{ message: string }> {
  if (DATA_SOURCE === 'api') return authApi.resetPassword(request);
  return delay({ message: 'Password reset successfully' });
}

export async function getCurrentUser(): Promise<User> {
  if (DATA_SOURCE === 'api') return authApi.getCurrentUser();
  return delay(mockUser);
}
