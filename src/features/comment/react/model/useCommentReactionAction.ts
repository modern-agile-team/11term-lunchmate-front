import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { isAuthenticated } from '@/shared/lib/auth/session';
import { getApiMessage } from '@/shared/lib/api/getApiMessage';
import type { MainPostComment } from '@/entities/comment';
import { likeComment, unlikeComment } from '../api';
import { useCommentReactionState } from './useCommentReactionState';

interface UseCommentReactionActionParams {
  onRequireLogin: () => void;
  invalidateCommentCaches: (postId: number) => Promise<unknown>;
}

export const useCommentReactionAction = ({
  onRequireLogin,
  invalidateCommentCaches,
}: UseCommentReactionActionParams) => {
  const reactionState = useCommentReactionState();
  const likeCommentMutation = useMutation({
    mutationFn: (comment: MainPostComment) =>
      comment.liked
        ? unlikeComment(comment.postId, comment.id)
        : likeComment(comment.postId, comment.id),
  });

  const handleCommentReaction = async (comment: MainPostComment) => {
    if (!isAuthenticated()) {
      reactionState.setCommentLikeMessage('로그인 후 댓글을 좋아요할 수 있어요.');
      reactionState.setCommentLikeTone('error');
      onRequireLogin();
      return;
    }

    try {
      reactionState.setLikingCommentId(comment.id);
      await likeCommentMutation.mutateAsync(comment);
      await invalidateCommentCaches(comment.postId);
    } catch (error) {
      reactionState.setCommentLikeTone('error');
      if (isAxiosError(error) && error.response?.status === 401) {
        reactionState.setCommentLikeMessage('로그인 후 이용할 수 있어요.');
        onRequireLogin();
        return;
      }
      reactionState.setCommentLikeMessage(getApiMessage(error, '댓글 좋아요를 반영하지 못했어요.'));
    } finally {
      reactionState.setLikingCommentId(null);
    }
  };

  return {
    handleCommentReaction,
    likingCommentId: reactionState.likingCommentId,
    commentLikeMessage: reactionState.commentLikeMessage,
    commentLikeTone: reactionState.commentLikeTone,
    isCommentLikePending: likeCommentMutation.isPending,
    resetCommentReactionsState: reactionState.resetCommentReactionsState,
  };
};
