import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useState } from 'react';
import { getApiMessage } from '@/shared/lib/api/getApiMessage';
import type { MainPostComment } from '@/entities/comment';
import { updateComment } from '../api';

interface UseEditCommentActionParams {
  onRequireLogin: () => void;
  invalidateCommentCaches: (postId: number) => Promise<unknown>;
}

export const useEditCommentAction = ({
  onRequireLogin,
  invalidateCommentCaches,
}: UseEditCommentActionParams) => {
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentValue, setEditingCommentValue] = useState('');
  const [commentEditMessage, setCommentEditMessage] = useState('');
  const [commentEditTone, setCommentEditTone] = useState<'success' | 'error'>('success');
  const updateCommentMutation = useMutation({
    mutationFn: (payload: { postId: number; commentId: number; content: string }) =>
      updateComment(payload.postId, payload.commentId, { content: payload.content }),
  });

  const clearEditFeedback = () => {
    setCommentEditMessage('');
    setCommentEditTone('success');
  };

  const resetCommentEditState = () => {
    setEditingCommentId(null);
    setEditingCommentValue('');
    clearEditFeedback();
  };

  const beginEdit = (comment: MainPostComment) => {
    clearEditFeedback();
    setEditingCommentId(comment.id);
    setEditingCommentValue(comment.content);
  };

  const changeEditValue = (value: string) => {
    setEditingCommentValue(value);
  };

  const cancelEdit = () => {
    resetCommentEditState();
  };

  const submitEdit = async (comment: MainPostComment) => {
    const trimmedContent = editingCommentValue.trim();
    if (trimmedContent === '') {
      setCommentEditMessage('댓글 내용을 다시 확인해주세요.');
      setCommentEditTone('error');
      return;
    }

    try {
      await updateCommentMutation.mutateAsync({
        postId: comment.postId,
        commentId: comment.id,
        content: trimmedContent,
      });
      setEditingCommentId(null);
      setEditingCommentValue('');
      setCommentEditMessage('댓글을 수정했어요.');
      setCommentEditTone('success');
      await invalidateCommentCaches(comment.postId);
    } catch (error) {
      setCommentEditTone('error');
      if (isAxiosError(error) && error.response?.status === 401) {
        setCommentEditMessage('로그인 후 이용할 수 있어요.');
        onRequireLogin();
        return;
      }
      setCommentEditMessage(getApiMessage(error, '댓글을 수정하지 못했어요.'));
    }
  };

  return {
    editingCommentId,
    editingCommentValue,
    beginEdit,
    changeEditValue,
    cancelEdit,
    submitEdit,
    commentEditMessage,
    commentEditTone,
    clearEditFeedback,
    isCommentUpdatePending: updateCommentMutation.isPending,
    resetCommentEditState,
  };
};
