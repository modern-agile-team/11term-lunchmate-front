import { queryOptions } from '@tanstack/react-query';
import { getMyUser } from './me';

export const myUserQueryOptions = () =>
  queryOptions({
    queryKey: ['myUser'],
    queryFn: getMyUser,
  });
