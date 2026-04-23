import { useEffect } from 'react';
import { authSessionSelectors, useAuthSessionStore } from '@/shared/lib/auth/session';

const AuthSessionBootstrap = () => {
  const hasHydrated = useAuthSessionStore(authSessionSelectors.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) {
      void useAuthSessionStore.persist.rehydrate();
    }
  }, [hasHydrated]);

  return null;
};

export default AuthSessionBootstrap;
