import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { isAuthenticated } from '@/shared/lib/auth/session';
import { getApiMessage } from '@/shared/lib/api/getApiMessage';
import type { MainPostComment } from '@/entities/comment';
import { dislikeComment, likeComment } from '../api';
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
    mutationFn: ({ postId, commentId }: { postId: number; commentId: number }) =>
      likeComment(postId, commentId),
  });
  const dislikeCommentMutation = useMutation({
    mutationFn: ({ postId, commentId }: { postId: number; commentId: number }) =>
      dislikeComment(postId, commentId),
  });

  const handleCommentReaction = async (comment: MainPostComment, type: 'like' | 'dislike') => {
    if (!isAuthenticated()) {
      if (type === 'like') {
        reactionState.setCommentLikeMessage('로그인 후 댓글을 좋아요할 수 있어요.');
        reactionState.setCommentLikeTone('error');
      } else {
        reactionState.setCommentDislikeMessage('로그인 후 댓글을 싫어요할 수 있어요.');
        reactionState.setCommentDislikeTone('error');
      }
      onRequireLogin();
      return;
    }

    try {
      if (type === 'like') {
        reactionState.setLikingCommentId(comment.id);
        await likeCommentMutation.mutateAsync({ postId: comment.postId, commentId: comment.id });
      } else {
        reactionState.setDislikingCommentId(comment.id);
        await dislikeCommentMutation.mutateAsync({
          postId: comment.postId,
          commentId: comment.id,
        });
      }
      await invalidateCommentCaches(comment.postId);
    } catch (error) {
      if (type === 'like') {
        reactionState.setCommentLikeTone('error');
        if (isAxiosError(error) && error.response?.status === 401) {
          reactionState.setCommentLikeMessage('로그인 후 이용할 수 있어요.');
          onRequireLogin();
          return;
        }
        reactionState.setCommentLikeMessage(
          getApiMessage(error, '댓글 좋아요를 반영하지 못했어요.'),
        );
      } else {
        reactionState.setCommentDislikeTone('error');
        if (isAxiosError(error) && error.response?.status === 401) {
          reactionState.setCommentDislikeMessage('로그인 후 이용할 수 있어요.');
          onRequireLogin();
          return;
        }
        reactionState.setCommentDislikeMessage(
          getApiMessage(error, '댓글 싫어요를 반영하지 못했어요.'),
        );
      }
    } finally {
      reactionState.setLikingCommentId(null);
      reactionState.setDislikingCommentId(null);
    }
  };

  return {
    handleCommentReaction,
    likingCommentId: reactionState.likingCommentId,
    dislikingCommentId: reactionState.dislikingCommentId,
    commentLikeMessage: reactionState.commentLikeMessage,
    commentLikeTone: reactionState.commentLikeTone,
    commentDislikeMessage: reactionState.commentDislikeMessage,
    commentDislikeTone: reactionState.commentDislikeTone,
    isCommentLikePending: likeCommentMutation.isPending,
    isCommentDislikePending: dislikeCommentMutation.isPending,
    resetCommentReactionsState: reactionState.resetCommentReactionsState,
  };
};
