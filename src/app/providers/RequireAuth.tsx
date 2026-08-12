import type { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { authSessionSelectors, useAuthSessionStore } from '@/shared/lib/auth/session';

interface RequireAuthProps {
  children: ReactNode;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const hasHydrated = useAuthSessionStore(authSessionSelectors.hasHydrated);
  const accessToken = useAuthSessionStore(authSessionSelectors.accessToken);
  const isCookieCheckComplete = useAuthSessionStore(authSessionSelectors.isCookieCheckComplete);
  const isAuthed = useAuthSessionStore(authSessionSelectors.isAuthenticated);

  const isChecking = !hasHydrated || (!accessToken && !isCookieCheckComplete);

  if (isChecking) {
    return null;
  }

  if (!isAuthed) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RequireAuth;
