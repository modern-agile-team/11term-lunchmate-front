import client from '@/shared/api/client';
import type { PostDetailResponse, UpdatePostRequest } from '@/entities/post';

export async function updatePost(
  postId: number,
  payload: UpdatePostRequest,
): Promise<PostDetailResponse> {
  const response = await client.patch<PostDetailResponse>(`/api/v1/posts/${postId}`, payload);

  return response.data;
}
