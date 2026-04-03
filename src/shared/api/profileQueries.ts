import { queryOptions } from '@tanstack/react-query';
import { getMyProfile } from '@/shared/api/profile';

export const myProfileQueryOptions = () =>
  queryOptions({
    queryKey: ['myProfile'],
    queryFn: getMyProfile,
  });
