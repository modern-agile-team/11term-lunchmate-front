import { useQueryClient } from '@tanstack/react-query';
import {
  invalidatePostCaches,
  syncEditedPost,
  type MainPostDetail,
  type MainPostItem,
  type PostDetailResponse,
  type PostSyncRequest,
} from '@/entities/post';
import { useDeletePostAction } from '@/features/post/delete';
import { usePostReactionAction } from '@/features/post/react';

interface UsePostDetailControllerParams {
  selectedPostDetail: MainPostDetail | null;
  postDetailQuery: { data: PostDetailResponse | undefined };
  postItems: MainPostItem[];
  onRequireLogin: () => void;
  setSelectedPostId: (postId: number | null) => void;
  closeDeleteConfirm: () => void;
  closeEditModal: () => void;
}

export const usePostDetailController = ({
  selectedPostDetail,
  postDetailQuery,
  postItems,
  onRequireLogin,
  setSelectedPostId,
  closeDeleteConfirm,
  closeEditModal,
}: UsePostDetailControllerParams) => {
  const queryClient = useQueryClient();
  const reactionAction = usePostReactionAction({
    postId: postDetailQuery.data?.id ?? null,
    onRequireLogin,
    invalidatePostCaches: (postId) => invalidatePostCaches(queryClient, postId),
  });
  const deleteAction = useDeletePostAction({
    selectedPostDetail,
    postItems,
    queryClient,
    onRequireLogin,
    setSelectedPostId,
    closeDeleteConfirm,
    closeEditModal,
  });

  const handleEditPostSuccess = (syncedPost: PostSyncRequest) => {
    void syncEditedPost(queryClient, syncedPost.postId, setSelectedPostId, closeEditModal);
  };

  return {
    ...reactionAction,
    ...deleteAction,
    invalidatePostCaches: (postId: number) => invalidatePostCaches(queryClient, postId),
    handleEditPostSuccess,
  };
};
