import { io, type Socket } from 'socket.io-client';
import { getAccessToken } from '@/shared/lib/auth/session';

let socket: Socket | null = null;

export const getRoomSocket = (): Socket => {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_URL || undefined, {
      autoConnect: false,
      withCredentials: true,
      auth: (callback) => {
        const accessToken = getAccessToken();

        callback(accessToken ? { token: accessToken } : {});
      },
    });
  }

  return socket;
};
