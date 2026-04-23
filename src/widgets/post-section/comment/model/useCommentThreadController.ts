import { useQueryClient } from '@tanstack/react-query';
import { invalidateCommentCaches } from '@/entities/comment';
import { useCreateCommentAction } from '@/features/comment/create';
import { useDeleteCommentAction } from '@/features/comment/delete';
import { useEditCommentAction } from '@/features/comment/edit';
import { useCommentReactionAction } from '@/features/comment/react';
import type { MainPostComment } from '@/entities/comment';
import type { CommentComposerState, CommentEditorState, CommentReactionState } from './types';

interface UseCommentThreadControllerParams {
  selectedPostId: number | null;
  onRequireLogin: () => void;
  invalidatePostCaches: (postId: number) => Promise<unknown>;
}

export const useCommentThreadController = ({
  selectedPostId,
  onRequireLogin,
  invalidatePostCaches: invalidatePostSectionCaches,
}: UseCommentThreadControllerParams) => {
  const queryClient = useQueryClient();
  const invalidateCaches = (postId: number) =>
    invalidateCommentCaches(queryClient, postId, invalidatePostSectionCaches);

  const composerAction = useCreateCommentAction({
    selectedPostId,
    onRequireLogin,
    invalidateCommentCaches: invalidateCaches,
  });
  const editAction = useEditCommentAction({
    onRequireLogin,
    invalidateCommentCaches: invalidateCaches,
  });
  const deleteAction = useDeleteCommentAction({
    onRequireLogin,
    invalidateCommentCaches: invalidateCaches,
  });
  const reactionAction = useCommentReactionAction({
    onRequireLogin,
    invalidateCommentCaches: invalidateCaches,
  });

  const composer: CommentComposerState = {
    inputValue: composerAction.commentInputValue,
    changeInputValue: composerAction.setCommentInputValue,
    submit: composerAction.handleCommentSubmit,
    isPending: composerAction.isCommentSubmitPending,
    message: composerAction.commentActionMessage,
    tone: composerAction.commentActionTone,
  };

  const editor: CommentEditorState = {
    editingCommentId: editAction.editingCommentId,
    editingCommentValue: editAction.editingCommentValue,
    deletingCommentId: deleteAction.deletingCommentId,
    editMessage: editAction.commentEditMessage,
    editTone: editAction.commentEditTone,
    deleteMessage: deleteAction.commentDeleteMessage,
    deleteTone: deleteAction.commentDeleteTone,
    startEdit: (comment: MainPostComment) => {
      deleteAction.cancelDelete();
      editAction.beginEdit(comment);
    },
    changeEditValue: editAction.changeEditValue,
    cancelEdit: editAction.cancelEdit,
    submitEdit: editAction.submitEdit,
    startDelete: (commentId: number) => {
      editAction.cancelEdit();
      deleteAction.beginDelete(commentId);
    },
    cancelDelete: deleteAction.cancelDelete,
    confirmDelete: deleteAction.confirmDelete,
  };

  const reactions: CommentReactionState = {
    handleCommentReaction: reactionAction.handleCommentReaction,
    likingCommentId: reactionAction.likingCommentId,
    dislikingCommentId: reactionAction.dislikingCommentId,
    commentLikeMessage: reactionAction.commentLikeMessage,
    commentLikeTone: reactionAction.commentLikeTone,
    commentDislikeMessage: reactionAction.commentDislikeMessage,
    commentDislikeTone: reactionAction.commentDislikeTone,
  };

  const resetCommentTransientState = () => {
    composerAction.resetCommentComposerState();
    editAction.resetCommentEditState();
    deleteAction.resetCommentDeleteState();
    reactionAction.resetCommentReactionsState();
  };

  return {
    composer,
    editor,
    reactions,
    resetCommentTransientState,
  };
};
