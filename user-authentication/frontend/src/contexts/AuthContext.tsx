'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import api, { endpoints, handleApiError } from '@/lib/api';
import { User, AuthContextType, LoginRequest, RegisterRequest } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const response = await api.get(endpoints.auth.me);
      setUser(response.data.user);
    } catch (error) {
      // User is not authenticated, which is fine
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      setLoading(true);
      const response = await api.post(endpoints.auth.login, credentials);
      setUser(response.data.user);
      toast.success('Login successful!');
    } catch (error) {
      const message = handleApiError(error);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      setLoading(true);
      const response = await api.post(endpoints.auth.register, {
        email: userData.email,
        username: userData.username,
        password: userData.password,
      });
      setUser(response.data.user);
      toast.success('Registration successful! Welcome!');
    } catch (error) {
      const message = handleApiError(error);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await api.post(endpoints.auth.logout);
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      // Even if logout fails on server, clear local state
      setUser(null);
      const message = handleApiError(error);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Higher-order component for protected routes
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth();

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      );
    }

    if (!user) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return null;
    }

    return <Component {...props} />;
  };
}