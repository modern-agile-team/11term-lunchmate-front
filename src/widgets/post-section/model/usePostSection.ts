import { useQuery, useQueryClient } from '@tanstack/react-query';

import { myUserQueryOptions } from '@/entities/user';

import { useCommentActions } from './useCommentActions';
import { useInfinitePosts } from './useInfinitePosts';
import { usePostComments } from './usePostComments';
import { usePostReactions } from './usePostReactions';
import { usePostSelection } from './usePostSelection';
import { toEditPostFormValues } from './helpers';
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
  const { data: myUserData } = useQuery(myUserQueryOptions());

  const { loadMoreRef, selectedCategory, setSelectedCategory, postsQuery, postItems } =
    useInfinitePosts();

  const {
    selectedPostId,
    setSelectedPostId,
    selectedPost,
    postDetailQuery,
    selectedPostDetail,
    canEditSelectedPost,
    handleSelectPost,
  } = usePostSelection({
    postItems,
    selectedCategory,
    setSelectedCategory,
    postSyncRequest,
    onPostSyncHandled,
    myUserId: myUserData?.id ?? null,
  });

  const postReactions = usePostReactions({
    selectedPostDetail,
    postDetailQuery,
    postItems,
    queryClient,
    onRequireLogin,
    setSelectedPostId,
  });

  const postComments = usePostComments({
    selectedPostId,
    myUserId: myUserData?.id ?? null,
  });

  const commentActions = useCommentActions({
    selectedPostId,
    onRequireLogin,
    invalidatePostCaches: postReactions.invalidatePostCaches,
    queryClient,
  });

  const handlePostSelect = (postId: number) => {
    handleSelectPost(postId);
    commentActions.resetCommentTransientState();
  };

  return {
    loadMoreRef,
    selectedCategory,
    setSelectedCategory,
    postsQuery,
    postItems,

    selectedPostId,
    selectedPost,
    selectedPostDetail,
    postDetailQuery,
    canEditSelectedPost,

    commentsQuery: postComments.commentsQuery,
    selectedPostComments: postComments.selectedPostComments,

    reactionErrorMessage: postReactions.reactionErrorMessage,
    handleSelectPost: handlePostSelect,
    handlePostReaction: postReactions.handlePostReaction,
    isLikePostPending: postReactions.isLikePostPending,
    isDislikePostPending: postReactions.isDislikePostPending,

    commentInputValue: commentActions.commentInputValue,
    setCommentInputValue: commentActions.setCommentInputValue,
    handleCommentSubmit: commentActions.handleCommentSubmit,
    isCommentSubmitPending: commentActions.isCommentSubmitPending,
    commentActionMessage: commentActions.commentActionMessage,
    commentActionTone: commentActions.commentActionTone,

    editingCommentId: commentActions.editingCommentId,
    editingCommentValue: commentActions.editingCommentValue,
    setEditingCommentValue: commentActions.setEditingCommentValue,
    handleCommentUpdate: commentActions.handleCommentUpdate,
    commentEditMessage: commentActions.commentEditMessage,
    commentEditTone: commentActions.commentEditTone,

    deletingCommentId: commentActions.deletingCommentId,
    handleCommentDelete: commentActions.handleCommentDelete,
    commentDeleteMessage: commentActions.commentDeleteMessage,
    commentDeleteTone: commentActions.commentDeleteTone,

    handleCommentReaction: commentActions.handleCommentReaction,
    likingCommentId: commentActions.likingCommentId,
    dislikingCommentId: commentActions.dislikingCommentId,
    commentLikeMessage: commentActions.commentLikeMessage,
    commentLikeTone: commentActions.commentLikeTone,
    commentDislikeMessage: commentActions.commentDislikeMessage,
    commentDislikeTone: commentActions.commentDislikeTone,

    isEditPostModalOpen: postReactions.isEditPostModalOpen,
    setIsEditPostModalOpen: postReactions.setIsEditPostModalOpen,
    isDeleteConfirmModalOpen: postReactions.isDeleteConfirmModalOpen,
    setIsDeleteConfirmModalOpen: postReactions.setIsDeleteConfirmModalOpen,
    deleteErrorMessage: postReactions.deleteErrorMessage,
    handleDeletePost: postReactions.handleDeletePost,
    isDeletePostPending: postReactions.isDeletePostPending,
    editPostInitialValues: selectedPostDetail
      ? toEditPostFormValues(selectedPostDetail)
      : undefined,

    setEditingCommentId: commentActions.setEditingCommentId,
    setDeletingCommentId: commentActions.setDeletingCommentId,
    setCommentDeleteMessage: commentActions.setCommentDeleteMessage,
    setCommentEditMessage: commentActions.setCommentEditMessage,
    setCommentEditTone: commentActions.setCommentEditTone,
    setCommentDeleteTone: commentActions.setCommentDeleteTone,
    setCommentLikeMessage: commentActions.setCommentLikeMessage,
    setCommentLikeTone: commentActions.setCommentLikeTone,
    setCommentDislikeMessage: commentActions.setCommentDislikeMessage,
    setCommentDislikeTone: commentActions.setCommentDislikeTone,

    handleEditPostSuccess: postReactions.handleEditPostSuccess,
  };
};
