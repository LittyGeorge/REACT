import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { AuthSession } from '../features/auth/types/auth';
import type { SessionUser } from '../types/common';

interface AuthState {
  token: string | null;
  user: SessionUser | null;
  isHydrated: boolean;
  setSession: (session: AuthSession) => void;
  setUser: (user: SessionUser) => void;
  setHydrated: (isHydrated: boolean) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(persist(
  (set) => ({
    token: null,
    user: null,
    isHydrated: false,
    setSession: (session) => set({ token: session.accessToken, user: session.user }),
    setUser: (user) => set({ user }),
    setHydrated: (isHydrated) => set({ isHydrated }),
    clearSession: () => set({ token: null, user: null }),
  }),
  {
    name: 'service-operations-session',
    storage: createJSONStorage(() => localStorage),
    partialize: ({ token, user }) => ({ token, user }) as AuthState,
    onRehydrateStorage: () => (state) => state?.setHydrated(true),
  },
));
