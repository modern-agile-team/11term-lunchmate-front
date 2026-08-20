import client from '@/shared/api/client';
import type { GetCommentsParams, GetCommentsResponse } from '../model/types';

export async function getComments(
  postId: number,
  params: GetCommentsParams = {},
): Promise<GetCommentsResponse> {
  const response = await client.get<GetCommentsResponse>(`/api/v1/posts/${postId}/comments`, {
    params: {
      cursor: params.cursor,
      limit: params.limit,
    },
  });

  return response.data;
}
