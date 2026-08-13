import { queryOptions } from '@tanstack/react-query';
import { getFriendRequests, getFriends, searchUsers } from './friends';

export const friendsQueryOptions = () =>
  queryOptions({
    queryKey: ['friends'],
    queryFn: getFriends,
  });

export const friendRequestsQueryOptions = () =>
  queryOptions({
    queryKey: ['friendRequests'],
    queryFn: getFriendRequests,
  });

export const userSearchQueryOptions = (keyword: string) =>
  queryOptions({
    queryKey: ['userSearch', keyword],
    queryFn: () => searchUsers(keyword),
    enabled: keyword.trim().length > 0,
  });
