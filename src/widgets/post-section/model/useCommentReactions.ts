import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { isAxiosError } from 'axios';

import { isAuthenticated } from '@/features/auth';
import { likeComment, dislikeComment } from '@/features/comment-actions';

import { getApiMessage } from './helpers';
import type { MainPostComment } from './types';

type MessageTone = 'success' | 'error';

interface UseCommentReactionsParams {
  onRequireLogin: () => void;
  invalidateCommentCaches: (postId: number) => Promise<unknown>;
}

export const useCommentReactions = ({
  onRequireLogin,
  invalidateCommentCaches,
}: UseCommentReactionsParams) => {
  const [commentLikeMessage, setCommentLikeMessage] = useState('');
  const [commentLikeTone, setCommentLikeTone] = useState<MessageTone>('success');
  const [likingCommentId, setLikingCommentId] = useState<number | null>(null);

  const [commentDislikeMessage, setCommentDislikeMessage] = useState('');
  const [commentDislikeTone, setCommentDislikeTone] = useState<MessageTone>('success');
  const [dislikingCommentId, setDislikingCommentId] = useState<number | null>(null);

  const likeCommentMutation = useMutation({
    mutationFn: ({ postId, commentId }: { postId: number; commentId: number }) =>
      likeComment(postId, commentId),
  });

  const dislikeCommentMutation = useMutation({
    mutationFn: ({ postId, commentId }: { postId: number; commentId: number }) =>
      dislikeComment(postId, commentId),
  });

  const handleCommentMutationError = (
    setter: (message: string) => void,
    fallback: string,
    error: unknown,
  ) => {
    if (isAxiosError(error) && error.response?.status === 401) {
      setter('로그인 후 이용할 수 있어요.');
      onRequireLogin();
      return;
    }

    setter(getApiMessage(error, fallback));
  };

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
        await likeCommentMutation.mutateAsync({
          postId: comment.postId,
          commentId: comment.id,
        });
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
        handleCommentMutationError(
          setCommentLikeMessage,
          '댓글 좋아요를 반영하지 못했어요.',
          error,
        );
      } else {
        setCommentDislikeTone('error');
        handleCommentMutationError(
          setCommentDislikeMessage,
          '댓글 싫어요를 반영하지 못했어요.',
          error,
        );
      }
    } finally {
      setLikingCommentId(null);
      setDislikingCommentId(null);
    }
  };

  const resetCommentReactionsState = () => {
    setCommentLikeMessage('');
    setCommentLikeTone('success');
    setLikingCommentId(null);
    setCommentDislikeMessage('');
    setCommentDislikeTone('success');
    setDislikingCommentId(null);
  };

  return {
    handleCommentReaction,

    likingCommentId,
    dislikingCommentId,

    commentLikeMessage,
    setCommentLikeMessage,
    commentLikeTone,
    setCommentLikeTone,

    commentDislikeMessage,
    setCommentDislikeMessage,
    commentDislikeTone,
    setCommentDislikeTone,

    isCommentLikePending: likeCommentMutation.isPending,
    isCommentDislikePending: dislikeCommentMutation.isPending,
    resetCommentReactionsState,
  };
};
