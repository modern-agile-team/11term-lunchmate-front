import client from '@/shared/api/client';
import type { DislikeCommentResponse, LikeCommentResponse } from '@/entities/comment';

export async function likeComment(postId: number, commentId: number): Promise<LikeCommentResponse> {
  const response = await client.post<LikeCommentResponse>(
    `/api/v1/posts/${postId}/comments/${commentId}/like`,
  );

  return response.data;
}

export async function dislikeComment(
  postId: number,
  commentId: number,
): Promise<DislikeCommentResponse> {
  const response = await client.post<DislikeCommentResponse>(
    `/api/v1/posts/${postId}/comments/${commentId}/dislike`,
  );

  return response.data;
}
