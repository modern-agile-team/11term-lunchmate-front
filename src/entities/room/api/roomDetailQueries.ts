import { queryOptions } from '@tanstack/react-query';
import { getRoomDetail } from './roomDetail';
import { roomQueryKeys } from './roomQueryKeys';

export const roomDetailQueryOptions = (roomId: number) =>
  queryOptions({
    queryKey: roomQueryKeys.detail(roomId),
    queryFn: () => getRoomDetail(roomId),
  });
