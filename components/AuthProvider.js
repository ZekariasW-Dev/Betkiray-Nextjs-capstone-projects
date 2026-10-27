'use client';

import { createContext, useContext, useEffect, useMemo } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const currentUser = useAuthStore(state => state.currentUser);
  const hasHydrated = useAuthStore(state => state.hasHydrated);
  const logout = useAuthStore(state => state.logout);

  useEffect(() => {
    if (!useAuthStore.persist.hasHydrated()) useAuthStore.persist.rehydrate();
  }, []);

  const value = useMemo(() => ({
    user: currentUser,
    isLoading: !hasHydrated,
    error: '',
    refresh: () => currentUser,
    signOut: logout
  }), [currentUser, hasHydrated, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used within AuthProvider.');
  return value;
}
