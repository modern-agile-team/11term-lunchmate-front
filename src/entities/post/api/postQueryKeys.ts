import type { GetPostsParams } from '../model/types';

export const postQueryKeys = {
  all: () => ['posts'] as const,
  lists: () => [...postQueryKeys.all(), 'list'] as const,
  list: (params: GetPostsParams = {}) => [...postQueryKeys.lists(), params] as const,
  infiniteList: (params: GetPostsParams = {}) =>
    [...postQueryKeys.lists(), 'infinite', params] as const,
  details: () => [...postQueryKeys.all(), 'detail'] as const,
  detail: (postId: number) => [...postQueryKeys.details(), postId] as const,
};
