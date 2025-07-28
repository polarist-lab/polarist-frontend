'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authAPI, usersAPI } from '@/lib/api';

interface User {
  id: number;
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
  locale: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signin: () => void;
  signup: (guestId?: string) => void;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
  migrateGuestData: (guestId: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      // Check if we're in the browser environment before accessing localStorage
      if (typeof window === 'undefined') {
        console.log('Auth: Server-side, skipping token check');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('auth_token');
      console.log('Auth: Token found:', !!token);
      
      if (!token) {
        console.log('Auth: No token found, user not authenticated');
        setLoading(false);
        return;
      }

      console.log('Auth: Fetching user with token');
      const response = await usersAPI.getMe();
      console.log('Auth: User fetched successfully:', response.user);
      setUser(response.user);
    } catch (error) {
      console.error('Auth: Failed to fetch user:', error);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signin = () => {
    authAPI.googleSignin();
  };

  const signup = (guestId?: string) => {
    authAPI.googleSignup(guestId);
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const migrateGuestData = async (guestId: string) => {
    try {
      const result = await authAPI.migrateGuestData(guestId);
      return result;
    } catch (error) {
      console.error('Guest data migration error:', error);
      return { success: false, message: 'Migration failed' };
    }
  };

  const refetchUser = async () => {
    setLoading(true);
    await fetchUser();
  };

  useEffect(() => {
    // Only fetch user, don't handle URL tokens here (handled in callback page)
    fetchUser();
  }, []);

  const value = {
    user,
    loading,
    signin,
    signup,
    logout,
    refetchUser,
    migrateGuestData,
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