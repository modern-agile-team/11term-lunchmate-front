import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import type { RoomListFilters } from '../model/types';
import { getRooms } from './roomList';
import { roomQueryKeys } from './roomQueryKeys';

export const roomListQueryOptions = (filters: RoomListFilters = {}) =>
  queryOptions({
    queryKey: roomQueryKeys.list(filters),
    queryFn: () => getRooms(filters),
  });

export const roomInfiniteListQueryOptions = (filters: RoomListFilters = {}, limit = 10) =>
  infiniteQueryOptions({
    queryKey: roomQueryKeys.infiniteList(filters, limit),
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) =>
      getRooms({
        ...filters,
        cursor: pageParam,
        limit,
      }),
    getNextPageParam: (lastPage) => (lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined),
  });
