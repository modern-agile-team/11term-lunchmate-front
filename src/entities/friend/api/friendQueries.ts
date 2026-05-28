import { queryOptions } from '@tanstack/react-query';
import { getFriendRequests, getFriends } from './friends';

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
