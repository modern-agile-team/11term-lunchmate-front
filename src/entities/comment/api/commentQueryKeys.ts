import type { GetCommentsParams } from '../model/types';

export const commentQueryKeys = {
  all: () => ['comments'] as const,
  lists: () => [...commentQueryKeys.all(), 'list'] as const,
  list: (postId: number) => [...commentQueryKeys.lists(), postId] as const,
  infiniteList: (postId: number, params: GetCommentsParams = {}) =>
    [...commentQueryKeys.list(postId), 'infinite', params] as const,
};
