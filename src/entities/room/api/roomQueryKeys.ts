import type { RoomListFilters } from '../model/types';

export const roomQueryKeys = {
  all: () => ['rooms'] as const,
  lists: () => [...roomQueryKeys.all(), 'list'] as const,
  list: (filters: RoomListFilters = {}) => [...roomQueryKeys.lists(), filters] as const,
  infiniteList: (filters: RoomListFilters = {}, limit = 10) =>
    [...roomQueryKeys.lists(), 'infinite', filters, limit] as const,
  details: () => [...roomQueryKeys.all(), 'detail'] as const,
  detail: (roomId: number) => [...roomQueryKeys.details(), roomId] as const,
  membersAll: () => [...roomQueryKeys.all(), 'members'] as const,
  members: (roomId: number) => [...roomQueryKeys.membersAll(), roomId] as const,
  me: () => [...roomQueryKeys.all(), 'me'] as const,
};
