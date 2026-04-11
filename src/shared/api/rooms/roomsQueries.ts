import { queryOptions } from '@tanstack/react-query';
import { getRooms, type RoomListFilters } from '@/shared/api/rooms/rooms';

export const roomsListQueryOptions = (filters: RoomListFilters = {}) =>
  queryOptions({
    queryKey: ['rooms', 'list', filters],
    queryFn: () => getRooms(filters),
  });
