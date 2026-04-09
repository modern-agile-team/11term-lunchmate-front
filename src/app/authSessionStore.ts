import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const AUTH_SESSION_STORAGE_KEY = 'lunchmate-auth-session';

interface AuthSessionState {
  accessToken: string | null;
  hasHydrated: boolean;
  setAccessToken: (accessToken: string) => void;
  clearAccessToken: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useAuthSessionStore = create<AuthSessionState>()(
  persist(
    (set) => ({
      accessToken: null,
      hasHydrated: false,
      setAccessToken: (accessToken) => set({ accessToken }),
      clearAccessToken: () => set({ accessToken: null }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: AUTH_SESSION_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
      }),
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export const authSessionSelectors = {
  accessToken: (state: AuthSessionState) => state.accessToken,
  hasHydrated: (state: AuthSessionState) => state.hasHydrated,
  isAuthenticated: (state: AuthSessionState) => Boolean(state.accessToken),
};

export const getAccessToken = () =>
  authSessionSelectors.accessToken(useAuthSessionStore.getState());

export const isAuthenticated = () =>
  authSessionSelectors.isAuthenticated(useAuthSessionStore.getState());

export const setAuthAccessToken = (accessToken: string) =>
  useAuthSessionStore.getState().setAccessToken(accessToken);

export const clearAuthSession = () => useAuthSessionStore.getState().clearAccessToken();
