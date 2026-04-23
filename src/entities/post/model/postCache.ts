import type { QueryClient } from '@tanstack/react-query';
import { postQueryKeys } from '../api/postQueryKeys';

export const invalidatePostCaches = (queryClient: QueryClient, postId: number) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: postQueryKeys.lists() }),
    queryClient.invalidateQueries({ queryKey: postQueryKeys.detail(postId) }),
  ]);

export const syncEditedPost = (
  queryClient: QueryClient,
  postId: number,
  setSelectedPostId: (postId: number | null) => void,
  closeEditModal: () => void,
) => {
  setSelectedPostId(postId);
  closeEditModal();

  return Promise.all([
    queryClient.invalidateQueries({ queryKey: postQueryKeys.lists() }),
    queryClient.invalidateQueries({ queryKey: postQueryKeys.detail(postId) }),
  ]);
};
