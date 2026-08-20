import client from '@/shared/api/client';
import type { CreatePostRequest, PostDetailResponse } from '@/entities/post';

export async function createPost(payload: CreatePostRequest): Promise<PostDetailResponse> {
  const response = await client.post<PostDetailResponse>('/api/v1/posts', payload);

  return response.data;
}
