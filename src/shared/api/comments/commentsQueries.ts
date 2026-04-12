import { queryOptions } from '@tanstack/react-query';
import { getComments, type GetCommentsParams } from './comments';

export const commentQueries = {
  all: () => ['comments'] as const,
  lists: () => [...commentQueries.all(), 'list'] as const,
  list: (postId: number, params: GetCommentsParams = {}) =>
    queryOptions({
      queryKey: [...commentQueries.lists(), postId, params],
      queryFn: () => getComments(postId, params),
    }),
};
