import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import { getRoomDetail, getRoomMembers, getRooms, type RoomListFilters } from '@/shared/api/rooms/rooms';

export const roomQueries = {
  all: () => ['rooms'] as const,
  lists: () => [...roomQueries.all(), 'list'] as const,
  list: (filters: RoomListFilters = {}) =>
    queryOptions({
      queryKey: [...roomQueries.lists(), filters],
      queryFn: () => getRooms(filters),
    }),
  infiniteList: (filters: RoomListFilters = {}, size = 10) =>
    infiniteQueryOptions({
      queryKey: [...roomQueries.lists(), 'infinite', filters, size],
      initialPageParam: undefined as string | undefined,
      queryFn: ({ pageParam }) =>
        getRooms({
          ...filters,
          cursor: pageParam,
          size,
        }),
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
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
