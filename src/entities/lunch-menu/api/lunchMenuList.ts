import client from '@/shared/api/client';
import type { MainLunchMenu } from '../model/types';

interface GetMealMenusResponse {
  items: MainLunchMenu[];
}

export async function getLunchMenus(): Promise<MainLunchMenu[]> {
  const response = await client.get<GetMealMenusResponse>('/api/v1/meal-menus');

  return response.data.items;
}