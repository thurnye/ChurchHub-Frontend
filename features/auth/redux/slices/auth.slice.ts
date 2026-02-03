import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tokenManager } from '@/core/utils/tokenManager.utils';
import * as authRepo from '../../services/auth.repository';
import type {
  AuthState,
  LoginCredentials,
  SignupCredentials,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '../../types/auth.types';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  status: 'idle',
  error: null,
};

// Login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authRepo.login(credentials);
      // Store tokens
      tokenManager.setAccessToken(response.accessToken);
      await tokenManager.setRefreshToken(response.refreshToken);
      return response.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  },
);

// Signup
export const signupUser = createAsyncThunk(
  'auth/signup',
  async (credentials: SignupCredentials, { rejectWithValue }) => {
    try {
      const response = await authRepo.signup(credentials);
      // Store tokens
      tokenManager.setAccessToken(response.accessToken);
      await tokenManager.setRefreshToken(response.refreshToken);
      return response.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Signup failed');
    }
  },
);

// Logout
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authRepo.logout();
      await tokenManager.clear();
    } catch (error: any) {
      // Clear tokens even if API call fails
      await tokenManager.clear();
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  },
);

// Get Current User
export const fetchCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authRepo.getCurrentUser();
      return user;
    } catch (error: any) {
      await tokenManager.clear();
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  },
);

// Forgot Password
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (request: ForgotPasswordRequest, { rejectWithValue }) => {
    try {
      const response = await authRepo.forgotPassword(request);
      return response.message;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send reset email');
    }
  },
);

// Reset Password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (request: ResetPasswordRequest, { rejectWithValue }) => {
    try {
      const response = await authRepo.resetPassword(request);
      return response.message;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reset password');
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = 'idle';
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        // Clear state even on error
        state.user = null;
        state.isAuthenticated = false;
        state.status = 'idle';
        state.error = null;
      })
      // Get Current User
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.status = 'succeeded';
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = 'idle';
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
