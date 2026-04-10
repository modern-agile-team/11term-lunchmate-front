import { queryOptions } from '@tanstack/react-query';
import { getRoomDetail, getRoomMembers, getRooms, type RoomListFilters } from '@/shared/api/rooms/rooms';

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
  membersAll: () => [...roomQueries.all(), 'members'] as const,
  members: (roomId: number) =>
    queryOptions({
      queryKey: [...roomQueries.membersAll(), roomId],
      queryFn: () => getRoomMembers(roomId),
    }),
};
