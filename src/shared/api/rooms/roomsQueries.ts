import { queryOptions } from '@tanstack/react-query';
import { getRoomDetail, getRooms, type RoomListFilters } from '@/shared/api/rooms/rooms';

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
