import client from '@/shared/api/client';
import type { LikeCommentResponse } from '@/entities/comment';

export async function likeComment(postId: number, commentId: number): Promise<LikeCommentResponse> {
  const response = await client.post<LikeCommentResponse>(
    `/api/v1/posts/${postId}/comments/${commentId}/like`,
  );

  return response.data;
}

export async function unlikeComment(
  postId: number,
  commentId: number,
): Promise<LikeCommentResponse> {
  const response = await client.delete<LikeCommentResponse>(
    `/api/v1/posts/${postId}/comments/${commentId}/like`,
  );

  return response.data;
}
