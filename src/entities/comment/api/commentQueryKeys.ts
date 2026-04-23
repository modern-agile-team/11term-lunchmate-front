export const commentQueryKeys = {
  all: () => ['comments'] as const,
  lists: () => [...commentQueryKeys.all(), 'list'] as const,
  list: (postId: number, params: { page?: number; size?: number } = {}) =>
    [...commentQueryKeys.lists(), postId, params] as const,
};
