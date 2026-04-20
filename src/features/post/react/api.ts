import client from '@/shared/api/client';
import type { DislikePostResponse, LikePostResponse } from '@/entities/post';

export async function likePost(postId: number): Promise<LikePostResponse> {
  const response = await client.post<LikePostResponse>(`/api/v1/posts/${postId}/like`);

  return response.data;
}

export async function dislikePost(postId: number): Promise<DislikePostResponse> {
  const response = await client.post<DislikePostResponse>(`/api/v1/posts/${postId}/dislike`);

  return response.data;
}
