import { commentQueryKeys } from '@/entities/comment';
import { useCreateCommentAction } from '@/features/comment/create';
import { useDeleteCommentAction } from '@/features/comment/delete';
import { useEditCommentAction } from '@/features/comment/edit';
import { useCommentReactionAction } from '@/features/comment/react';
import type { QueryClient } from '@tanstack/react-query';

interface UseCommentActionsParams {
  selectedPostId: number | null;
  onRequireLogin: () => void;
  invalidatePostCaches: (postId: number) => Promise<unknown>;
  queryClient: QueryClient;
}

export const useCommentActions = ({
  selectedPostId,
  onRequireLogin,
  invalidatePostCaches,
  queryClient,
}: UseCommentActionsParams) => {
  const invalidateCommentList = async (postId: number) =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: commentQueryKeys.list(postId) }),
      queryClient.invalidateQueries({ queryKey: commentQueryKeys.lists() }),
    ]);

  const invalidateCommentCaches = async (postId: number) => {
    await invalidatePostCaches(postId);
    await invalidateCommentList(postId);
  };

  const composer = useCreateCommentAction({
    selectedPostId,
    onRequireLogin,
    invalidateCommentCaches,
  });

  const editAction = useEditCommentAction({
    onRequireLogin,
    invalidateCommentCaches,
  });
  const deleteAction = useDeleteCommentAction({
    onRequireLogin,
    invalidateCommentCaches,
  });

  const reactions = useCommentReactionAction({
    onRequireLogin,
    invalidateCommentCaches,
  });

  const editor = {
    ...editAction,
    ...deleteAction,
    resetCommentEditorState: () => {
      editAction.resetCommentEditState();
      deleteAction.resetCommentDeleteState();
    },
  };

  const resetCommentTransientState = () => {
    composer.resetCommentComposerState();
    editor.resetCommentEditorState();
    reactions.resetCommentReactionsState();
  };

  return {
    composer,
    editor,
    reactions,
    resetCommentTransientState,
  };
};
