import { queryOptions } from '@tanstack/react-query';
import { getRooms } from './rooms';

export const roomsListQueryOptions = () =>
  queryOptions({
    queryKey: ['rooms', 'list'],
    queryFn: getRooms,
  });
