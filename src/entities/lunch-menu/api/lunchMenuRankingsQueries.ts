import { queryOptions } from '@tanstack/react-query';
import type { LunchReactionType } from '../model/types';
import { getLunchMenuRankings } from './lunchMenuRankings';
import { lunchMenuQueryKeys } from './lunchMenuQueryKeys';

export const lunchMenuRankingsQueryOptions = (actionType: NonNullable<LunchReactionType>) =>
  queryOptions({
    queryKey: lunchMenuQueryKeys.rankings(actionType),
    queryFn: () => getLunchMenuRankings(actionType),
  });
