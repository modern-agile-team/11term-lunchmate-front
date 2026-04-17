import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { isAxiosError } from 'axios';

import { updateComment, deleteComment } from '@/features/comment-actions';

import { getApiMessage } from './helpers';
import type { MainPostComment } from './types';

type MessageTone = 'success' | 'error';

interface UseCommentEditorParams {
  onRequireLogin: () => void;
  invalidateCommentCaches: (postId: number) => Promise<unknown>;
}

export const useCommentEditor = ({
  onRequireLogin,
  invalidateCommentCaches,
}: UseCommentEditorParams) => {
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentValue, setEditingCommentValue] = useState('');
  const [commentEditMessage, setCommentEditMessage] = useState('');
  const [commentEditTone, setCommentEditTone] = useState<MessageTone>('success');

  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null);
  const [commentDeleteMessage, setCommentDeleteMessage] = useState('');
  const [commentDeleteTone, setCommentDeleteTone] = useState<MessageTone>('success');

  const updateCommentMutation = useMutation({
    mutationFn: (payload: { postId: number; commentId: number; content: string }) =>
      updateComment(payload.postId, payload.commentId, { content: payload.content }),
  });

  const deleteCommentMutation = useMutation({
    mutationFn: ({ postId, commentId }: { postId: number; commentId: number }) =>
      deleteComment(postId, commentId),
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

  const handleCommentUpdate = async (comment: MainPostComment) => {
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
      handleCommentMutationError(setCommentEditMessage, '댓글을 수정하지 못했어요.', error);
    }
  };

  const handleCommentDelete = async (comment: MainPostComment) => {
    try {
      await deleteCommentMutation.mutateAsync({
        postId: comment.postId,
        commentId: comment.id,
      });
      setDeletingCommentId(null);
      setCommentDeleteMessage('댓글을 삭제했어요.');
      setCommentDeleteTone('success');
      await invalidateCommentCaches(comment.postId);
    } catch (error) {
      setCommentDeleteTone('error');
      handleCommentMutationError(setCommentDeleteMessage, '댓글을 삭제하지 못했어요.', error);
    }
  };

  const resetCommentEditorState = () => {
    setEditingCommentId(null);
    setEditingCommentValue('');
    setCommentEditMessage('');
    setCommentEditTone('success');
    setDeletingCommentId(null);
    setCommentDeleteMessage('');
    setCommentDeleteTone('success');
  };

  return {
    editingCommentId,
    setEditingCommentId,
    editingCommentValue,
    setEditingCommentValue,
    handleCommentUpdate,
    commentEditMessage,
    setCommentEditMessage,
    commentEditTone,
    setCommentEditTone,

    deletingCommentId,
    setDeletingCommentId,
    handleCommentDelete,
    commentDeleteMessage,
    setCommentDeleteMessage,
    commentDeleteTone,
    setCommentDeleteTone,

    isCommentUpdatePending: updateCommentMutation.isPending,
    isCommentDeletePending: deleteCommentMutation.isPending,
    resetCommentEditorState,
  };
};
