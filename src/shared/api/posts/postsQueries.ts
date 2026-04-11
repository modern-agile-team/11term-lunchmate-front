import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import { getPosts, type GetPostsParams } from '@/shared/api/posts/posts';

export const postQueries = {
  all: () => ['posts'] as const,
  lists: () => [...postQueries.all(), 'list'] as const,
  list: (params: GetPostsParams = {}) =>
    queryOptions({
      queryKey: [...postQueries.lists(), params],
      queryFn: () => getPosts(params),
    }),
  infiniteList: ({ page, ...params }: GetPostsParams = {}) =>
    infiniteQueryOptions({
      queryKey: [...postQueries.lists(), 'infinite', params],
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
    }),
};
