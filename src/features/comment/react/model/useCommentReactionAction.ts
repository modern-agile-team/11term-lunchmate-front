import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useState } from 'react';
import { isAuthenticated } from '@/shared/lib/auth/session';
import { getApiMessage } from '@/shared/lib/api/getApiMessage';
import type { MainPostComment } from '@/entities/comment';
import { dislikeComment, likeComment } from '../api';

interface UseCommentReactionActionParams {
  onRequireLogin: () => void;
  invalidateCommentCaches: (postId: number) => Promise<unknown>;
}

export const useCommentReactionAction = ({
  onRequireLogin,
  invalidateCommentCaches,
}: UseCommentReactionActionParams) => {
  const [commentLikeMessage, setCommentLikeMessage] = useState('');
  const [commentLikeTone, setCommentLikeTone] = useState<'success' | 'error'>('success');
  const [likingCommentId, setLikingCommentId] = useState<number | null>(null);
  const [commentDislikeMessage, setCommentDislikeMessage] = useState('');
  const [commentDislikeTone, setCommentDislikeTone] = useState<'success' | 'error'>('success');
  const [dislikingCommentId, setDislikingCommentId] = useState<number | null>(null);
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
        setCommentLikeMessage('로그인 후 댓글을 좋아요할 수 있어요.');
        setCommentLikeTone('error');
      } else {
        setCommentDislikeMessage('로그인 후 댓글을 싫어요할 수 있어요.');
        setCommentDislikeTone('error');
      }
      onRequireLogin();
      return;
    }

    try {
      if (type === 'like') {
        setLikingCommentId(comment.id);
        await likeCommentMutation.mutateAsync({ postId: comment.postId, commentId: comment.id });
      } else {
        setDislikingCommentId(comment.id);
        await dislikeCommentMutation.mutateAsync({
          postId: comment.postId,
          commentId: comment.id,
        });
      }
      await invalidateCommentCaches(comment.postId);
    } catch (error) {
      if (type === 'like') {
        setCommentLikeTone('error');
        if (isAxiosError(error) && error.response?.status === 401) {
          setCommentLikeMessage('로그인 후 이용할 수 있어요.');
          onRequireLogin();
          return;
        }
        setCommentLikeMessage(getApiMessage(error, '댓글 좋아요를 반영하지 못했어요.'));
      } else {
        setCommentDislikeTone('error');
        if (isAxiosError(error) && error.response?.status === 401) {
          setCommentDislikeMessage('로그인 후 이용할 수 있어요.');
          onRequireLogin();
          return;
        }
        setCommentDislikeMessage(getApiMessage(error, '댓글 싫어요를 반영하지 못했어요.'));
      }
    } finally {
      setLikingCommentId(null);
      setDislikingCommentId(null);
    }
  };

  return {
    handleCommentReaction,
    likingCommentId,
    dislikingCommentId,
    commentLikeMessage,
    commentLikeTone,
    commentDislikeMessage,
    commentDislikeTone,
    isCommentLikePending: likeCommentMutation.isPending,
    isCommentDislikePending: dislikeCommentMutation.isPending,
    resetCommentReactionsState: () => {
      setCommentLikeMessage('');
      setCommentLikeTone('success');
      setLikingCommentId(null);
      setCommentDislikeMessage('');
      setCommentDislikeTone('success');
      setDislikingCommentId(null);
    },
  };
};
