import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import type { GetPostsParams } from '../model/types';
import { getPosts } from './postList';
import { postQueryKeys } from './postQueryKeys';

export const postListQueryOptions = (params: GetPostsParams = {}) =>
  queryOptions({
    queryKey: postQueryKeys.list(params),
    queryFn: () => getPosts(params),
  });

export const postInfiniteListQueryOptions = (params: GetPostsParams = {}) =>
  infiniteQueryOptions({
    queryKey: postQueryKeys.infiniteList(params),
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getPosts({
        ...params,
        page: pageParam,
      }),
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.pagination?.page ?? 1;
      const totalPages = lastPage.pagination?.totalPages;
      const hasNext = lastPage.pagination?.hasNext;

      if (hasNext === true) {
        return currentPage + 1;
      }

      if (typeof totalPages === 'number' && currentPage < totalPages) {
        return currentPage + 1;
      }

      return undefined;
    },
  });
