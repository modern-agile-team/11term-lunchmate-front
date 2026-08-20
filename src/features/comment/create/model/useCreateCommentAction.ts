import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useState } from 'react';
import { isAuthenticated } from '@/shared/lib/auth/session';
import { getApiMessage } from '@/shared/lib/api/getApiMessage';
import { createComment } from '../api';

interface UseCreateCommentActionParams {
  selectedPostId: number | null;
  onRequireLogin: () => void;
  invalidateCommentCaches: (postId: number) => Promise<unknown>;
}

export const useCreateCommentAction = ({
  selectedPostId,
  onRequireLogin,
  invalidateCommentCaches,
}: UseCreateCommentActionParams) => {
  const [commentInputValue, setCommentInputValue] = useState('');
  const [isCommentAnonymous, setIsCommentAnonymous] = useState(false);
  const [commentActionMessage, setCommentActionMessage] = useState('');
  const [commentActionTone, setCommentActionTone] = useState<'success' | 'error'>('success');
  const createCommentMutation = useMutation({
    mutationFn: ({
      postId,
      content,
      isAnonymous,
    }: {
      postId: number;
      content: string;
      isAnonymous: boolean;
    }) => createComment(postId, { content, isAnonymous }),
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
        isAnonymous: isCommentAnonymous,
      });
      setCommentInputValue('');
      setIsCommentAnonymous(false);
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

  return {
    commentInputValue,
    setCommentInputValue,
    isCommentAnonymous,
    setIsCommentAnonymous,
    handleCommentSubmit,
    isCommentSubmitPending: createCommentMutation.isPending,
    commentActionMessage,
    commentActionTone,
    resetCommentComposerState: () => {
      setCommentInputValue('');
      setIsCommentAnonymous(false);
      setCommentActionMessage('');
      setCommentActionTone('success');
    },
  };
};
