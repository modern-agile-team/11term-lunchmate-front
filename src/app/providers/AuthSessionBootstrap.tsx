import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getMyUser, myUserQueryOptions } from '@/entities/user';
import {
  authSessionSelectors,
  setCookieCheckComplete,
  setCookieSession,
  useAuthSessionStore,
} from '@/shared/lib/auth/session';

const AuthSessionBootstrap = () => {
  const hasHydrated = useAuthSessionStore(authSessionSelectors.hasHydrated);
  const accessToken = useAuthSessionStore(authSessionSelectors.accessToken);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!hasHydrated) {
      void useAuthSessionStore.persist.rehydrate();
    }
  }, [hasHydrated]);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (accessToken) {
      setCookieCheckComplete(true);
      return;
    }

    getMyUser()
      .then((user) => {
        setCookieSession(true);
        queryClient.setQueryData(myUserQueryOptions().queryKey, user);
      })
      .catch(() => {
        setCookieSession(false);
      })
      .finally(() => {
        setCookieCheckComplete(true);
      });
  }, [hasHydrated, accessToken, queryClient]);

  return null;
};

export default AuthSessionBootstrap;
