import { queryOptions } from '@tanstack/react-query';
import { getMyRoom } from './myRoom';
import { roomQueryKeys } from './roomQueryKeys';

export const myRoomQueryOptions = () =>
  queryOptions({
    queryKey: roomQueryKeys.me(),
    queryFn: getMyRoom,
    retry: false,
  });
