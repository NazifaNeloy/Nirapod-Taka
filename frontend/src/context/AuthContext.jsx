import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { apiClient } from '../api/client.js';

const AuthContext = createContext(null);

/**
 * Authentication Provider enforcing strict security rules:
 * - Stores ONLY non-sensitive user profile in memory.
 * - NEVER reads, stores, or logs tokens or passwords (token is managed via httpOnly cookie).
 * - Provides login, register, logout, and session check capabilities.
 * @param {object} props - Component props containing children.
 * @returns {JSX.Element} Auth provider wrapping application components.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check existing session via httpOnly cookie on app load
  useEffect(() => {
    let isMounted = true;
    async function restoreSession() {
      try {
        const { data, error } = await apiClient('/api/auth/me', { method: 'GET' });
        if (isMounted) {
          if (!error && data && data.user) {
            setUser(data.user);
          } else {
            setUser(null);
          }
        }
      } catch {
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    restoreSession();
    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Authenticates user with phone and password.
   * @param {object} credentials - Phone and password.
   * @returns {Promise<{success: boolean, error: object|null}>} Result status.
   */
  const login = async ({ phone, password }) => {
    const { data, error } = await apiClient('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password })
    });

    if (error) {
      return { success: false, error };
    }

    if (data && data.user) {
      setUser(data.user);
      return { success: true, error: null };
    }

    return {
      success: false,
      error: { code: 'AUTH_FAILED', message_bn: 'ফোন নম্বর বা পাসওয়ার্ড ভুল হয়েছে।' }
    };
  };

  /**
   * Registers a new user account.
   * @param {object} payload - User registration payload.
   * @returns {Promise<{success: boolean, error: object|null}>} Result status.
   */
  const register = async (payload) => {
    const { data, error } = await apiClient('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (error) {
      return { success: false, error };
    }

    if (data && data.user) {
      setUser(data.user);
      return { success: true, error: null };
    }

    return {
      success: false,
      error: { code: 'REGISTRATION_FAILED', message_bn: 'রেজিস্ট্রেশন সম্পন্ন করা যায়নি।' }
    };
  };

  /**
   * Logs out user by clearing cookie session on server and wiping in-memory profile.
   * @returns {Promise<void>}
   */
  const logout = async () => {
    try {
      await apiClient('/api/auth/logout', { method: 'POST' });
    } catch {
      // Continue client cleanup regardless of network outcome
    } finally {
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to access authentication context.
 * @returns {{ user: object|null, loading: boolean, isAuthenticated: boolean, login: Function, register: Function, logout: Function }}
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
