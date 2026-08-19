import { useEffect } from 'react';
import { authSessionSelectors, useAuthSessionStore } from '@/shared/lib/auth/session';
import { getRoomSocket } from './roomSocketClient';

const RoomSocketConnection = () => {
  const isAuthed = useAuthSessionStore(authSessionSelectors.isAuthenticated);
  const accessToken = useAuthSessionStore(authSessionSelectors.accessToken);

  useEffect(() => {
    const socket = getRoomSocket();

    if (isAuthed) {
      socket.connect();
    } else {
      socket.disconnect();
    }

    return () => {
      socket.disconnect();
    };
  }, [isAuthed, accessToken]);

  return null;
};

export default RoomSocketConnection;
