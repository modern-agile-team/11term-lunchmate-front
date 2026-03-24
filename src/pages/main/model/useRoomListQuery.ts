import { useQuery } from '@tanstack/react-query';

import { getRoomList } from '@/entities/room/api/getRoomList';
import type { RoomListParams } from '@/entities/room/model/types';

const DEFAULT_ROOM_LIST_SIZE = 10;

export const useRoomListQuery = (roomListParams: RoomListParams) => {
  return useQuery({
    queryKey: ['rooms', roomListParams],
    queryFn: () =>
      getRoomList({
        size: DEFAULT_ROOM_LIST_SIZE,
        ...roomListParams,
      }),
  });
};
