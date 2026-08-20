import client from '@/shared/api/client';
import type { PostCategory } from '../model/types';

export async function getPostCategories(): Promise<PostCategory[]> {
  const response = await client.get<PostCategory[]>('/api/v1/post-categories');

  return response.data;
}
