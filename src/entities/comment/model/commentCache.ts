import type { QueryClient } from '@tanstack/react-query';
import { commentQueryKeys } from '../api/commentQueryKeys';

export const invalidateCommentList = (queryClient: QueryClient, postId: number) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: commentQueryKeys.list(postId) }),
    queryClient.invalidateQueries({ queryKey: commentQueryKeys.lists() }),
  ]);

export const invalidateCommentCaches = async (
  queryClient: QueryClient,
  postId: number,
  invalidatePostCaches: (postId: number) => Promise<unknown>,
) => {
  await invalidatePostCaches(postId);
  await invalidateCommentList(queryClient, postId);
};
