import { queryOptions } from '@tanstack/react-query';
import { getMe } from '@/shared/api/users/me';

export const myUserQueryOptions = () =>
  queryOptions({
    queryKey: ['myUser'],
    queryFn: getMe,
  });
