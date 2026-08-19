import type { LunchReactionType } from '../model/types';

export const lunchMenuQueryKeys = {
  all: () => ['lunchMenus'] as const,
  lists: () => [...lunchMenuQueryKeys.all(), 'list'] as const,
  rankings: (actionType: NonNullable<LunchReactionType>) =>
    [...lunchMenuQueryKeys.all(), 'rankings', actionType] as const,
};
