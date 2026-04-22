import type { QueryClient } from '@tanstack/react-query';
import { roomQueryKeys } from '../api/roomQueryKeys';

export const invalidateRoomCaches = (queryClient: QueryClient, roomId: number) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: roomQueryKeys.lists() }),
    queryClient.invalidateQueries({ queryKey: roomQueryKeys.detail(roomId) }),
  ]);
