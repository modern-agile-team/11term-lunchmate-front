import client from '@/shared/api/client';
import type { CreatePostRequest, CreatePostResponse } from '@/entities/post';

export async function createPost(payload: CreatePostRequest): Promise<CreatePostResponse> {
  const response = await client.post<CreatePostResponse>('/api/v1/posts', payload);

  return response.data;
}
