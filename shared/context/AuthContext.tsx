import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { router } from "expo-router";
import * as authApi from "@/features/auth/services/auth.api.service";
import { tokenManager } from "@/core/utils/tokenManager.utils";
import type { User, SignupCredentials } from "@/features/auth/types/auth.types";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to extract error message from API response
function extractErrorMessage(err: any, fallback: string): string {
  // Backend format: { success: false, error: { message: "..." } }
  if (err?.response?.data?.error?.message) {
    return err.response.data.error.message;
  }
  // Alternative format: { message: "..." }
  if (err?.response?.data?.message) {
    return err.response.data.message;
  }
  // Axios error message
  if (err?.message) {
    return err.message;
  }
  return fallback;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start loading to check stored token
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    let isMounted = true;

    const checkAuthStatus = async () => {
      try {
        const storedRefreshToken = await tokenManager.getRefreshToken();
        // Load tenant ID from storage
        await tokenManager.loadTenantId();

        if (!storedRefreshToken) {
          // No stored token, user needs to login
          if (isMounted) setIsLoading(false);
          return;
        }

        // Try to refresh the token
        const tokens = await authApi.refreshToken(storedRefreshToken);

        if (isMounted) {
          tokenManager.setAccessToken(tokens.accessToken);
          await tokenManager.setRefreshToken(tokens.refreshToken);
          setIsAuthenticated(true);
        }
      } catch (err) {
        // Token refresh failed, clear everything
        console.log('Auth check failed, clearing tokens');
        await tokenManager.clear();
        if (isMounted) {
          setIsAuthenticated(false);
          setUser(null);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    checkAuthStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.login({ email, password });

      // Store tokens
      tokenManager.setAccessToken(response.accessToken);
      await tokenManager.setRefreshToken(response.refreshToken);

      // Store tenant ID for API requests
      if (response.user?.tenantId) {
        await tokenManager.saveTenantId(response.user.tenantId);
      }

      // Update state
      setUser(response.user);
      setIsAuthenticated(true);

      // Navigate to main app
      router.replace("/(tabs)");
    } catch (err: any) {
      const message = extractErrorMessage(err, "Login failed");
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.signup(credentials);

      // Store tokens
      tokenManager.setAccessToken(response.accessToken);
      await tokenManager.setRefreshToken(response.refreshToken);

      // Store tenant ID for API requests
      if (response.user?.tenantId) {
        await tokenManager.saveTenantId(response.user.tenantId);
      }

      // Update state
      setUser(response.user);
      setIsAuthenticated(true);

      // Navigate to main app
      router.replace("/(tabs)");
    } catch (err: any) {
      const message = extractErrorMessage(err, "Signup failed");
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);

    try {
      await authApi.logout();
    } catch (err) {
      // Ignore logout errors, still clear local state
    }

    // Clear tokens and state
    await tokenManager.clear();
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);

    // Navigate to login screen
    router.replace("/login");
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        error,
        login,
        signup,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
