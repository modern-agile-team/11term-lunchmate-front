import { infiniteQueryOptions } from '@tanstack/react-query';
import type { GetCommentsParams } from '../model/types';
import { getComments } from './commentList';
import { commentQueryKeys } from './commentQueryKeys';

export const commentInfiniteListQueryOptions = (
  postId: number,
  params: GetCommentsParams = {},
  limit = 10,
) =>
  infiniteQueryOptions({
    queryKey: commentQueryKeys.infiniteList(postId, { ...params, limit }),
    initialPageParam: undefined as number | undefined,
    queryFn: ({ pageParam }) =>
      getComments(postId, {
        ...params,
        cursor: pageParam,
        limit,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined,
  });
