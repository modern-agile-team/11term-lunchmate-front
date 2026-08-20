import client from '@/shared/api/client';
import type { PostViewCountResponse } from '../model/types';

export async function increasePostViewCount(postId: number): Promise<PostViewCountResponse> {
  const response = await client.patch<PostViewCountResponse>(`/api/v1/posts/${postId}/views`);

  return response.data;
}
