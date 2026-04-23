import client from '@/shared/api/client';
import type { PostDetailResponse } from '../model/types';

export async function getPostDetail(postId: number): Promise<PostDetailResponse> {
  const response = await client.get<PostDetailResponse>(`/api/v1/posts/${postId}`);

  return response.data;
}
