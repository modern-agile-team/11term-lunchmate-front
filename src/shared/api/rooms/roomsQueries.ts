import { queryOptions } from '@tanstack/react-query';
import { getRoomDetail, getRooms, type RoomListFilters } from '@/shared/api/rooms/rooms';

export const roomQueries = {
  all: () => ['rooms'] as const,
  lists: () => [...roomQueries.all(), 'list'] as const,
  list: (filters: RoomListFilters = {}) =>
    queryOptions({
      queryKey: [...roomQueries.lists(), filters],
      queryFn: () => getRooms(filters),
    }),
  details: () => [...roomQueries.all(), 'detail'] as const,
  detail: (roomId: number) =>
    queryOptions({
      queryKey: [...roomQueries.details(), roomId],
      queryFn: () => getRoomDetail(roomId),
    }),
};
