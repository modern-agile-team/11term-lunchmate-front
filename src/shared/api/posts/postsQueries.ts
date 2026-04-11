import { queryOptions } from '@tanstack/react-query';
import { getPosts, type GetPostsParams } from '@/shared/api/posts/posts';

export const postQueries = {
  all: () => ['posts'] as const,
  lists: () => [...postQueries.all(), 'list'] as const,
  list: (params: GetPostsParams = {}) =>
    queryOptions({
      queryKey: [...postQueries.lists(), params],
      queryFn: () => getPosts(params),
    }),
};
