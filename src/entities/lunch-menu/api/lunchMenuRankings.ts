import client from '@/shared/api/client';
import type { LunchReactionType, MainLunchMenu } from '../model/types';

interface GetMealMenusResponse {
  items: MainLunchMenu[];
}

export async function getLunchMenuRankings(
  actionType: NonNullable<LunchReactionType>,
): Promise<MainLunchMenu[]> {
  const response = await client.get<GetMealMenusResponse>('/api/v1/meal-menus/rankings', {
    params: { actionType },
  });

  return response.data.items;
}
