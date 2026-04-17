import { commentQueryKeys } from '@/entities/comment';
import type { QueryClient } from '@tanstack/react-query';

import { useCommentComposer } from './useCommentComposer';
import { useCommentEditor } from './useCommentEditor';
import { useCommentReactions } from './useCommentReactions';

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

  const composer = useCommentComposer({
    selectedPostId,
    onRequireLogin,
    invalidateCommentCaches,
  });

  const editor = useCommentEditor({
    onRequireLogin,
    invalidateCommentCaches,
  });

  const reactions = useCommentReactions({
    onRequireLogin,
    invalidateCommentCaches,
  });

  const resetCommentTransientState = () => {
    composer.resetCommentComposerState();
    editor.resetCommentEditorState();
    reactions.resetCommentReactionsState();
  };

  return {
    ...composer,
    ...editor,
    ...reactions,
    resetCommentTransientState,
  };
};
