import type { PostSectionDetailState } from './usePostSectionViewModel.types';

export const buildPostSectionDetail = ({
  selectedPost,
  selectedPostDetail,
  postDetailQuery,
  canEditSelectedPost,
  reactionErrorMessage,
  handlePostReaction,
  isLikePostPending,
  isDislikePostPending,
}: PostSectionDetailState) => ({
  selectedPost,
  selectedPostDetail,
  postDetailQuery,
  canEditSelectedPost,
  reactionErrorMessage,
  handlePostReaction,
  isLikePostPending,
  isDislikePostPending,
});
