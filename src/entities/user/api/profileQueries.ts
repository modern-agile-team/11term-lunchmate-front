import { queryOptions } from '@tanstack/react-query';
import { getMyProfile } from './profile';

export const myProfileQueryOptions = () =>
  queryOptions({
    queryKey: ['myProfile'],
    queryFn: getMyProfile,
  });
