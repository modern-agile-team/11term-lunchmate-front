import { queryOptions } from '@tanstack/react-query';
import { getRoomDetail, getRooms, type RoomListFilters } from '@/shared/api/rooms/rooms';

<<<<<<< Updated upstream
export const roomsListQueryOptions = (filters: RoomListFilters = {}) =>
  queryOptions({
    queryKey: ['rooms', 'list', filters],
    queryFn: () => getRooms(filters),
  });

export const roomDetailQueryOptions = (roomId: number) =>
  queryOptions({
    queryKey: ['rooms', 'detail', roomId],
    queryFn: () => getRoomDetail(roomId),
  });
=======
export const roomQueries = {
  all: () => ['rooms'] as const,
  lists: () => [...roomQueries.all(), 'list'] as const,
  list: (filters: RoomListFilters = {}) =>
    queryOptions({
      queryKey: [...roomQueries.lists(), filters],
      queryFn: () => getRooms(filters),
    }),
};
>>>>>>> Stashed changes
