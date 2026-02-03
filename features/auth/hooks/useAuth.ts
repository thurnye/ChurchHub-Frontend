import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/app.hooks';
import {
  loginUser,
  signupUser,
  logoutUser,
  fetchCurrentUser,
  forgotPassword,
  resetPassword,
  clearError,
} from '../redux/slices/auth.slice';
import type {
  LoginCredentials,
  SignupCredentials,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '../types/auth.types';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, status, error } = useAppSelector((state) => state.auth);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const result = await dispatch(loginUser(credentials));
      return result.meta.requestStatus === 'fulfilled';
    },
    [dispatch],
  );

  const signup = useCallback(
    async (credentials: SignupCredentials) => {
      const result = await dispatch(signupUser(credentials));
      return result.meta.requestStatus === 'fulfilled';
    },
    [dispatch],
  );

  const logout = useCallback(async () => {
    await dispatch(logoutUser());
  }, [dispatch]);

  const getCurrentUser = useCallback(async () => {
    await dispatch(fetchCurrentUser());
  }, [dispatch]);

  const requestPasswordReset = useCallback(
    async (request: ForgotPasswordRequest) => {
      const result = await dispatch(forgotPassword(request));
      return result.meta.requestStatus === 'fulfilled';
    },
    [dispatch],
  );

  const resetUserPassword = useCallback(
    async (request: ResetPasswordRequest) => {
      const result = await dispatch(resetPassword(request));
      return result.meta.requestStatus === 'fulfilled';
    },
    [dispatch],
  );

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading: status === 'loading',
    error,
    login,
    signup,
    logout,
    getCurrentUser,
    requestPasswordReset,
    resetUserPassword,
    clearAuthError,
  };
}
