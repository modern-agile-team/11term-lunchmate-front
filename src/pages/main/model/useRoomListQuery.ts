import { useQuery } from '@tanstack/react-query';

import { getRoomList } from '@/entities/room/api/getRoomList';

const DEFAULT_ROOM_LIST_SIZE = 10;

export const useRoomListQuery = () => {
  return useQuery({
    queryKey: ['rooms', DEFAULT_ROOM_LIST_SIZE],
    queryFn: () =>
      getRoomList({
        size: DEFAULT_ROOM_LIST_SIZE,
      }),
  });
};
