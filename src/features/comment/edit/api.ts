import client from '@/shared/api/client';
import type { UpdateCommentRequest, UpdateCommentResponse } from '@/entities/comment';

export async function updateComment(
  postId: number,
  commentId: number,
  payload: UpdateCommentRequest,
): Promise<UpdateCommentResponse> {
  const response = await client.patch<UpdateCommentResponse>(
    `/api/v1/posts/${postId}/comments/${commentId}`,
    payload,
  );

  return response.data;
}
