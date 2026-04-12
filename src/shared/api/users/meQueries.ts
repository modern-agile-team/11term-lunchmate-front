import { queryOptions } from '@tanstack/react-query';
import { getMyUser } from '@/shared/api/users/me';

export const myUserQueryOptions = () =>
  queryOptions({
    queryKey: ['myUser'],
    queryFn: getMyUser,
  });
