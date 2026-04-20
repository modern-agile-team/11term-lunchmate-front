import client from '@/shared/api/client';
import type { CreateCommentRequest, CreateCommentResponse } from '@/entities/comment';

export async function createComment(
  postId: number,
  payload: CreateCommentRequest,
): Promise<CreateCommentResponse> {
  const response = await client.post<CreateCommentResponse>(`/api/v1/posts/${postId}/comments`, payload);

  return response.data;
}
