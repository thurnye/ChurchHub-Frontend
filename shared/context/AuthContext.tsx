import { createContext, useContext, useState, ReactNode } from "react";
import { router } from "expo-router";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Start as authenticated for demo
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>({
    id: "1",
    name: "Daniel Johnson",
    email: "daniel.johnson@email.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
  });

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate successful login
    setUser({
      id: "1",
      name: "Daniel Johnson",
      email: email,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    });
    setIsAuthenticated(true);
    setIsLoading(false);

    // Navigate to main app
    router.replace("/(tabs)");
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);

    // Navigate to login screen
    router.replace("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
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
