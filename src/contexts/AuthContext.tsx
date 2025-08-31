"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { apiService } from "@/services/api";

interface User {
  id: string;
  username: string;
  role: string;
  location_id?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Debug: Log state changes
  useEffect(() => {
    console.log('🔍 Auth state changed:', { isAuthenticated, isLoading, user: !!user });
  }, [isAuthenticated, isLoading, user]);

  useEffect(() => {
    // Check if user is already logged in via API
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setIsAuthenticated(true); // Add this line!
          console.log('🔐 Auth check successful, user authenticated');
        } else {
          // Clear any stale data
          localStorage.removeItem("auth-token");
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("user");
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        // Clear any stale data
        localStorage.removeItem("auth-token");
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    // Redirect logic
    if (!isLoading) {
      if (!isAuthenticated && pathname !== "/login") {
        router.push("/login");
      } else if (isAuthenticated && pathname === "/login") {
        router.push("/");
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      console.log('🔐 Login attempt for:', username);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log('🔐 Login response:', data);

      if (data.success && data.token) {
        const userData = {
          id: data.user.id,
          username: data.user.username,
          role: data.user.role,
          location_id: data.user.location_id,
        };

        console.log('🔐 User data:', userData);

        // Store user data in localStorage (token is in httpOnly cookie)
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("auth-token", data.token); // Store token in localStorage
        
        // Also set cookie for backup
        document.cookie = `auth-token=${data.token}; path=/; max-age=86400`; // 24 hours
        
        console.log('🔐 Stored token in localStorage:', data.token.substring(0, 20) + '...');
        console.log('🔐 Set token in cookie as backup');
        console.log('🔍 localStorage after storing:', {
            'auth-token': localStorage.getItem('auth-token'),
            'isAuthenticated': localStorage.getItem('isAuthenticated'),
            'user': localStorage.getItem('user')
        });
        console.log('🔍 Cookie after storing:', document.cookie);
        
        console.log('🔐 Setting user state...');
        setUser(userData);
        console.log('🔐 Setting isAuthenticated to true...');
        setIsAuthenticated(true);
        
        console.log('🔐 State after update - user:', userData);
        console.log('🔐 State after update - isAuthenticated: true');
        
        // Force immediate redirect after state update
        console.log('🔐 Redirecting to dashboard...');
        setTimeout(() => {
          if (window.location.pathname === '/login') {
            console.log('🔐 Force redirect to dashboard');
            window.location.href = '/';
          }
        }, 100);
        
        return true;
      } else {
        console.error('Login failed:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Call logout API
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local storage and state
      localStorage.removeItem("auth-token");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        isLoading,
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
