import { useQueryClient } from '@tanstack/react-query';
import { usePostDetailActions } from './usePostDetailActions';
import { usePostSectionActions } from './usePostSectionActions';
import { usePostSectionComments } from './usePostSectionComments';
import { usePostSectionData } from './usePostSectionData';
import { usePostSectionDialogs } from './usePostSectionDialogs';
import { usePostSectionViewModel } from './usePostSectionViewModel';
import type { PostSyncRequest } from './types';

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
  const queryClient = useQueryClient();
  const { infinitePosts, postSelection, postComments } = usePostSectionData({
    postSyncRequest,
    onPostSyncHandled,
  });

  const postDetailActions = usePostDetailActions({
    selectedPostDetail: postSelection.selectedPostDetail,
    postDetailQuery: postSelection.postDetailQuery,
    postItems: infinitePosts.postItems,
    queryClient,
    onRequireLogin,
    setSelectedPostId: postSelection.setSelectedPostId,
  });

  const comments = usePostSectionComments({
    selectedPostId: postSelection.selectedPostId,
    onRequireLogin,
    invalidatePostCaches: postDetailActions.invalidatePostCaches,
    queryClient,
    postComments,
  });

  const postSectionActions = usePostSectionActions({
    handleSelectPost: postSelection.handleSelectPost,
    resetCommentTransientState: comments.resetCommentTransientState,
  });
  const dialogs = usePostSectionDialogs({
    selectedPostDetail: postSelection.selectedPostDetail,
    postDetailActions,
  });

  return usePostSectionViewModel({
    selectedCategory: infinitePosts.selectedCategory,
    setSelectedCategory: infinitePosts.setSelectedCategory,
    list: {
      loadMoreRef: infinitePosts.loadMoreRef,
      postsQuery: infinitePosts.postsQuery,
      postItems: infinitePosts.postItems,
      selectedPostId: postSelection.selectedPostId,
      onPostSelect: postSectionActions.onPostSelect,
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
    comments: {
      commentsQuery: comments.commentsQuery,
      selectedPostComments: comments.selectedPostComments,
      commentActions: comments.commentActions,
    },
    dialogs,
  });
};
