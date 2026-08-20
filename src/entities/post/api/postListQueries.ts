import { infiniteQueryOptions } from '@tanstack/react-query';
import type { GetPostsParams } from '../model/types';
import { getPosts } from './postList';
import { postQueryKeys } from './postQueryKeys';

export const postInfiniteListQueryOptions = (params: GetPostsParams = {}, limit = 10) =>
  infiniteQueryOptions({
    queryKey: postQueryKeys.infiniteList({ ...params, limit }),
    initialPageParam: undefined as number | undefined,
    queryFn: ({ pageParam }) =>
      getPosts({
        ...params,
        cursor: pageParam,
        limit,
      }),
    getNextPageParam: (lastPage) => (lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined),
  });
