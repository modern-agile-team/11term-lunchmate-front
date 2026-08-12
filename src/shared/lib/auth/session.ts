import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const AUTH_SESSION_STORAGE_KEY = 'lunchmate-auth-session';

interface AuthSessionState {
  accessToken: string | null;
  refreshToken: string | null;
  hasHydrated: boolean;
  isCookieSession: boolean;
  isCookieCheckComplete: boolean;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearTokens: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  setCookieSession: (isCookieSession: boolean) => void;
  setCookieCheckComplete: (isCookieCheckComplete: boolean) => void;
}

export const useAuthSessionStore = create<AuthSessionState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      hasHydrated: false,
      isCookieSession: false,
      isCookieCheckComplete: false,
      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      clearTokens: () => set({ accessToken: null, refreshToken: null, isCookieSession: false }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      setCookieSession: (isCookieSession) => set({ isCookieSession }),
      setCookieCheckComplete: (isCookieCheckComplete) => set({ isCookieCheckComplete }),
    }),
    {
      name: AUTH_SESSION_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
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
  refreshToken: (state: AuthSessionState) => state.refreshToken,
  hasHydrated: (state: AuthSessionState) => state.hasHydrated,
  isCookieCheckComplete: (state: AuthSessionState) => state.isCookieCheckComplete,
  isAuthenticated: (state: AuthSessionState) => Boolean(state.accessToken) || state.isCookieSession,
};

export const getAccessToken = () =>
  authSessionSelectors.accessToken(useAuthSessionStore.getState());

export const getRefreshToken = () =>
  authSessionSelectors.refreshToken(useAuthSessionStore.getState());

export const isAuthenticated = () =>
  authSessionSelectors.isAuthenticated(useAuthSessionStore.getState());

export const setAuthTokens = (accessToken: string, refreshToken: string) =>
  useAuthSessionStore.getState().setTokens(accessToken, refreshToken);

export const setCookieSession = (isCookieSession: boolean) =>
  useAuthSessionStore.getState().setCookieSession(isCookieSession);

export const setCookieCheckComplete = (isCookieCheckComplete: boolean) =>
  useAuthSessionStore.getState().setCookieCheckComplete(isCookieCheckComplete);

export const clearAuthSession = () => useAuthSessionStore.getState().clearTokens();
