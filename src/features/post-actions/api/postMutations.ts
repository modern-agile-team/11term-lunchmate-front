import client from '@/shared/api/client';
import type {
  CreatePostRequest,
  CreatePostResponse,
  DislikePostResponse,
  LikePostResponse,
  PostDetailResponse,
  UpdatePostRequest,
} from '@/entities/post';

export async function createPost(payload: CreatePostRequest): Promise<CreatePostResponse> {
  const response = await client.post<CreatePostResponse>('/api/v1/posts', payload);

  return response.data;
}

export async function likePost(postId: number): Promise<LikePostResponse> {
  const response = await client.post<LikePostResponse>(`/api/v1/posts/${postId}/like`);

  return response.data;
}

export async function dislikePost(postId: number): Promise<DislikePostResponse> {
  const response = await client.post<DislikePostResponse>(`/api/v1/posts/${postId}/dislike`);

  return response.data;
}

export async function updatePost(
  postId: number,
  payload: UpdatePostRequest,
): Promise<PostDetailResponse> {
  const response = await client.patch<PostDetailResponse>(`/api/v1/posts/${postId}`, payload);

  return response.data;
}

export async function deletePost(postId: number): Promise<void> {
  await client.delete(`/api/v1/posts/${postId}`);
}
