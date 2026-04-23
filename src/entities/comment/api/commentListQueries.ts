import { queryOptions } from '@tanstack/react-query';
import type { GetCommentsParams } from '../model/types';
import { getComments } from './commentList';
import { commentQueryKeys } from './commentQueryKeys';

export const postCommentsQueryOptions = (
  postId: number,
  params: GetCommentsParams = {},
) =>
  queryOptions({
    queryKey: commentQueryKeys.list(postId, params),
    queryFn: () => getComments(postId, params),
  });
