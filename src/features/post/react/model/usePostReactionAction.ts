import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useState } from 'react';
import { getApiMessage } from '@/shared/lib/api/getApiMessage';
import { dislikePost, likePost } from '../api';

interface UsePostReactionActionParams {
  postId: number | null;
  onRequireLogin: () => void;
  invalidatePostCaches: (postId: number) => Promise<unknown>;
}

export const usePostReactionAction = ({
  postId,
  onRequireLogin,
  invalidatePostCaches,
}: UsePostReactionActionParams) => {
  const [reactionErrorMessage, setReactionErrorMessage] = useState('');
  const likePostMutation = useMutation({ mutationFn: likePost });
  const dislikePostMutation = useMutation({ mutationFn: dislikePost });

  const handlePostReaction = async (type: 'like' | 'dislike') => {
    if (postId === null) return;
    setReactionErrorMessage('');

    try {
      if (type === 'like') {
        await likePostMutation.mutateAsync(postId);
      } else {
        await dislikePostMutation.mutateAsync(postId);
      }
      await invalidatePostCaches(postId);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        setReactionErrorMessage(
          type === 'like'
            ? '로그인 후 게시글을 좋아요할 수 있어요.'
            : '로그인 후 게시글을 싫어요할 수 있어요.',
        );
        onRequireLogin();
        return;
      }

      setReactionErrorMessage(
        getApiMessage(
          error,
          type === 'like' ? '좋아요를 반영하지 못했어요.' : '싫어요를 반영하지 못했어요.',
        ),
      );
    }
  };

  return {
    reactionErrorMessage,
    setReactionErrorMessage,
    handlePostReaction,
    isLikePostPending: likePostMutation.isPending,
    isDislikePostPending: dislikePostMutation.isPending,
  };
};
