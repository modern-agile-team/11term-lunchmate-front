import { toPostEditorFormValues } from '@/features/post/editor';
import type { PostSyncRequest } from '@/entities/post';
import { usePostCommentSectionState } from './usePostCommentSectionState';
import { usePostSelectionAction } from './usePostSelectionAction';
import { usePostSectionControllers } from './usePostSectionControllers';
import { usePostSectionData } from './usePostSectionData';

interface UsePostSectionParams {
  postSyncRequest: PostSyncRequest | null;
  onPostSyncHandled: () => void;
  onRequireLogin: () => void;
}

export const usePostSection = ({
  postSyncRequest,
  onPostSyncHandled,
  onRequireLogin,
}: UsePostSectionParams) => {
  const { infinitePosts, postSelection, selectedPostCommentsQuery } = usePostSectionData({
    postSyncRequest,
    onPostSyncHandled,
  });
  const { dialogState, postDetailActions } = usePostSectionControllers({
    postSelection,
    postItems: infinitePosts.postItems,
    onRequireLogin,
  });
  const commentSection = usePostCommentSectionState({
    selectedPostId: postSelection.selectedPostId,
    onRequireLogin,
    invalidatePostCaches: postDetailActions.invalidatePostCaches,
    selectedPostCommentsQuery,
  });
  const selectionAction = usePostSelectionAction({
    handleSelectPost: postSelection.handleSelectPost,
    resetCommentTransientState: commentSection.actions.resetTransientState,
  });

  return {
    filter: {
      selectedCategory: infinitePosts.selectedCategory,
      setSelectedCategory: infinitePosts.setSelectedCategory,
    },
    list: {
      loadMoreRef: infinitePosts.loadMoreRef,
      postsQuery: infinitePosts.postsQuery,
      postItems: infinitePosts.postItems,
      selectedPostId: postSelection.selectedPostId,
      onPostSelect: selectionAction.handlePostSelect,
    },
    detail: {
      selectedPost: postSelection.selectedPost,
      selectedPostDetail: postSelection.selectedPostDetail,
      postDetailQuery: postSelection.postDetailQuery,
      canEditSelectedPost: postSelection.canEditSelectedPost,
      reactionErrorMessage: postDetailActions.reactionErrorMessage,
      handlePostReaction: postDetailActions.handlePostReaction,
      isLikePostPending: postDetailActions.isLikePostPending,
      isDislikePostPending: postDetailActions.isDislikePostPending,
    },
    comments: commentSection.sectionState,
    dialogs: {
      isEditPostModalOpen: dialogState.isEditPostModalOpen,
      setIsEditPostModalOpen: dialogState.setIsEditPostModalOpen,
      isDeleteConfirmModalOpen: dialogState.isDeleteConfirmModalOpen,
      setIsDeleteConfirmModalOpen: dialogState.setIsDeleteConfirmModalOpen,
      deleteErrorMessage: postDetailActions.deleteErrorMessage,
      handleDeletePost: postDetailActions.handleDeletePost,
      isDeletePostPending: postDetailActions.isDeletePostPending,
      editPostInitialValues: postSelection.selectedPostDetail
        ? toPostEditorFormValues(postSelection.selectedPostDetail)
        : undefined,
      handleEditPostSuccess: postDetailActions.handleEditPostSuccess,
    },
  };
};
