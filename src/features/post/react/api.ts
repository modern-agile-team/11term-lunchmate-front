import client from '@/shared/api/client';
import type { LikePostResponse } from '@/entities/post';

export async function likePost(postId: number): Promise<LikePostResponse> {
  const response = await client.post<LikePostResponse>(`/api/v1/posts/${postId}/like`);

  return response.data;
}

export async function unlikePost(postId: number): Promise<LikePostResponse> {
  const response = await client.delete<LikePostResponse>(`/api/v1/posts/${postId}/like`);

  return response.data;
}
