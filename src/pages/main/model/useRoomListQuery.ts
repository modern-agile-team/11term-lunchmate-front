import { queryOptions, useQuery } from '@tanstack/react-query';

import { getRoomList } from '@/entities/room/api/getRoomList';

export const roomListQueryOptions = () =>
  queryOptions({
    queryKey: ['rooms'],
    queryFn: () => getRoomList(),
  });

export const useRoomListQuery = () => {
  return useQuery(roomListQueryOptions());
};
