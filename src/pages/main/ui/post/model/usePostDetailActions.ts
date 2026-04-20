import type { QueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { postQueryKeys, type PostDetailResponse } from '@/entities/post';
import { useDeletePostAction } from '@/features/post/delete';
import { usePostReactionAction } from '@/features/post/react';
import type { MainPostDetail, MainPostItem, PostSyncRequest } from './types';

interface UsePostDetailActionsParams {
  selectedPostDetail: MainPostDetail | null;
  postDetailQuery: { data: PostDetailResponse | undefined };
  postItems: MainPostItem[];
  queryClient: QueryClient;
  onRequireLogin: () => void;
  setSelectedPostId: (postId: number | null) => void;
}

export const usePostDetailActions = ({
  selectedPostDetail,
  postDetailQuery,
  postItems,
  queryClient,
  onRequireLogin,
  setSelectedPostId,
}: UsePostDetailActionsParams) => {
  const [isEditPostModalOpen, setIsEditPostModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);

  const invalidatePostCaches = async (postId: number) =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: postQueryKeys.lists() }),
      queryClient.invalidateQueries({ queryKey: postQueryKeys.detail(postId) }),
    ]);

  const reactionAction = usePostReactionAction({
    postId: postDetailQuery.data?.id ?? null,
    onRequireLogin,
    invalidatePostCaches,
  });
  const deleteAction = useDeletePostAction({
    selectedPostDetail,
    postItems,
    queryClient,
    onRequireLogin,
    setSelectedPostId,
    closeDeleteConfirm: () => setIsDeleteConfirmModalOpen(false),
    closeEditModal: () => setIsEditPostModalOpen(false),
  });

  const handleEditPostSuccess = (syncedPost: PostSyncRequest) => {
    setSelectedPostId(syncedPost.postId);
    setIsEditPostModalOpen(false);
    void Promise.all([
      queryClient.invalidateQueries({ queryKey: postQueryKeys.lists() }),
      queryClient.invalidateQueries({ queryKey: postQueryKeys.detail(syncedPost.postId) }),
    ]);
  };

  return {
    ...reactionAction,
    ...deleteAction,
    invalidatePostCaches,
    isEditPostModalOpen,
    setIsEditPostModalOpen,
    isDeleteConfirmModalOpen,
    setIsDeleteConfirmModalOpen,
    handleEditPostSuccess,
  };
};
