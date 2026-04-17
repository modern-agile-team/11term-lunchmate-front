import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { isAxiosError } from 'axios';

import { isAuthenticated } from '@/features/auth';
import { createComment } from '@/features/comment-actions';

import { getApiMessage } from './helpers';

type MessageTone = 'success' | 'error';

interface UseCommentComposerParams {
  selectedPostId: number | null;
  onRequireLogin: () => void;
  invalidateCommentCaches: (postId: number) => Promise<unknown>;
}

export const useCommentComposer = ({
  selectedPostId,
  onRequireLogin,
  invalidateCommentCaches,
}: UseCommentComposerParams) => {
  const [commentInputValue, setCommentInputValue] = useState('');
  const [commentActionMessage, setCommentActionMessage] = useState('');
  const [commentActionTone, setCommentActionTone] = useState<MessageTone>('success');

  const createCommentMutation = useMutation({
    mutationFn: ({ postId, content }: { postId: number; content: string }) =>
      createComment(postId, { content }),
  });

  const handleCommentSubmit = async () => {
    if (selectedPostId === null) return;

    if (!isAuthenticated()) {
      setCommentActionMessage('로그인 후 댓글을 작성할 수 있어요.');
      setCommentActionTone('error');
      onRequireLogin();
      return;
    }

    const trimmedContent = commentInputValue.trim();
    if (trimmedContent === '') {
      setCommentActionMessage('댓글 내용을 다시 확인해주세요.');
      setCommentActionTone('error');
      return;
    }

    try {
      await createCommentMutation.mutateAsync({
        postId: selectedPostId,
        content: trimmedContent,
      });
      setCommentInputValue('');
      setCommentActionMessage('댓글을 등록했어요.');
      setCommentActionTone('success');
      await invalidateCommentCaches(selectedPostId);
    } catch (error) {
      setCommentActionTone('error');

      if (isAxiosError(error) && error.response?.status === 401) {
        setCommentActionMessage('로그인 후 댓글을 작성할 수 있어요.');
        onRequireLogin();
        return;
      }

      setCommentActionMessage(getApiMessage(error, '댓글을 등록하지 못했어요.'));
    }
  };

  const resetCommentComposerState = () => {
    setCommentInputValue('');
    setCommentActionMessage('');
    setCommentActionTone('success');
  };

  return {
    commentInputValue,
    setCommentInputValue,
    handleCommentSubmit,
    isCommentSubmitPending: createCommentMutation.isPending,
    commentActionMessage,
    commentActionTone,
    setCommentActionMessage,
    setCommentActionTone,
    resetCommentComposerState,
  };
};
