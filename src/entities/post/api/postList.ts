import client from '@/shared/api/client';
import type { GetPostsParams, GetPostsResponse } from '../model/types';

export async function getPosts(params: GetPostsParams = {}): Promise<GetPostsResponse> {
  const response = await client.get<GetPostsResponse>('/api/v1/posts', {
    params: {
      categoryId: params.categoryId,
      page: params.page,
      size: params.size,
    },
  });

  return response.data;
}
