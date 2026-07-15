import { queryOptions } from '@tanstack/react-query';
import { getLunchMenus } from './lunchMenuList';
import { lunchMenuQueryKeys } from './lunchMenuQueryKeys';

export const lunchMenuListQueryOptions = () =>
  queryOptions({
    queryKey: lunchMenuQueryKeys.lists(),
    queryFn: getLunchMenus,
  });