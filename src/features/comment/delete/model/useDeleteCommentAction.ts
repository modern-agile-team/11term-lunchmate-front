import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useState } from 'react';
import { getApiMessage } from '@/shared/lib/api/getApiMessage';
import type { MainPostComment } from '@/entities/comment';
import { deleteComment } from '../api';

interface UseDeleteCommentActionParams {
  onRequireLogin: () => void;
  invalidateCommentCaches: (postId: number) => Promise<unknown>;
}

export const useDeleteCommentAction = ({
  onRequireLogin,
  invalidateCommentCaches,
}: UseDeleteCommentActionParams) => {
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null);
  const [commentDeleteMessage, setCommentDeleteMessage] = useState('');
  const [commentDeleteTone, setCommentDeleteTone] = useState<'success' | 'error'>('success');
  const deleteCommentMutation = useMutation({
    mutationFn: ({ postId, commentId }: { postId: number; commentId: number }) =>
      deleteComment(postId, commentId),
  });

  const handleCommentDelete = async (comment: MainPostComment) => {
    try {
      await deleteCommentMutation.mutateAsync({ postId: comment.postId, commentId: comment.id });
      setDeletingCommentId(null);
      setCommentDeleteMessage('댓글을 삭제했어요.');
      setCommentDeleteTone('success');
      await invalidateCommentCaches(comment.postId);
    } catch (error) {
      setCommentDeleteTone('error');
      if (isAxiosError(error) && error.response?.status === 401) {
        setCommentDeleteMessage('로그인 후 이용할 수 있어요.');
        onRequireLogin();
        return;
      }
      setCommentDeleteMessage(getApiMessage(error, '댓글을 삭제하지 못했어요.'));
    }
  };

  return {
    deletingCommentId,
    setDeletingCommentId,
    handleCommentDelete,
    commentDeleteMessage,
    setCommentDeleteMessage,
    commentDeleteTone,
    setCommentDeleteTone,
    isCommentDeletePending: deleteCommentMutation.isPending,
    resetCommentDeleteState: () => {
      setDeletingCommentId(null);
      setCommentDeleteMessage('');
      setCommentDeleteTone('success');
    },
  };
};
