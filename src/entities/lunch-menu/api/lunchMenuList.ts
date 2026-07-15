import client from '@/shared/api/client';
import type { MainLunchMenu } from '../model/types';

export async function getLunchMenus(): Promise<MainLunchMenu[]> {
  const response = await client.get<MainLunchMenu[]>('/api/v1/lunch-menus');

  return response.data;
}