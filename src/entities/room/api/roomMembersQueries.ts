import { queryOptions } from '@tanstack/react-query';
import { getRoomMembers } from './roomMembers';
import { roomQueryKeys } from './roomQueryKeys';

export const roomMembersQueryOptions = (roomId: number) =>
  queryOptions({
    queryKey: roomQueryKeys.members(roomId),
    queryFn: () => getRoomMembers(roomId),
  });
