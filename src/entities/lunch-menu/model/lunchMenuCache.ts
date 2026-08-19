import type { QueryClient } from '@tanstack/react-query';
import { lunchMenuQueryKeys } from '../api/lunchMenuQueryKeys';
import type { MainLunchMenu } from './types';

export const patchLunchMenuReaction = (
  queryClient: QueryClient,
  menuId: number,
  patch: Pick<MainLunchMenu, 'likeCount' | 'dislikeCount' | 'myReaction'>,
) =>
  queryClient.setQueriesData<MainLunchMenu[]>({ queryKey: lunchMenuQueryKeys.all() }, (menus) =>
    menus?.map((menu) => (menu.id === menuId ? { ...menu, ...patch } : menu)),
  );
