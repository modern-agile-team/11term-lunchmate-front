import { queryOptions } from '@tanstack/react-query';
import { getRooms } from '@/shared/api/rooms/rooms';

export const roomsListQueryOptions = () =>
  queryOptions({
    queryKey: ['rooms', 'list'],
    queryFn: getRooms,
  });
