import client from '@/shared/api/client';
import type {
  CreateCommentRequest,
  CreateCommentResponse,
  DislikeCommentResponse,
  LikeCommentResponse,
  UpdateCommentRequest,
  UpdateCommentResponse,
} from '@/entities/comment';

export async function createComment(
  postId: number,
  payload: CreateCommentRequest,
): Promise<CreateCommentResponse> {
  const response = await client.post<CreateCommentResponse>(`/api/v1/posts/${postId}/comments`, payload);

  return response.data;
}

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

export async function deleteComment(postId: number, commentId: number): Promise<void> {
  await client.delete(`/api/v1/posts/${postId}/comments/${commentId}`);
}

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
