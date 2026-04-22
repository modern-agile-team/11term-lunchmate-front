import { useCommentThreadController } from '../comment/model/useCommentThreadController';
import type { PostCommentSectionControllerState } from '../comment/model/types';
import type { useSelectedPostCommentsQuery } from './useSelectedPostCommentsQuery';

interface UsePostCommentSectionStateParams {
  selectedPostId: number | null;
  onRequireLogin: () => void;
  invalidatePostCaches: (postId: number) => Promise<unknown>;
  selectedPostCommentsQuery: ReturnType<typeof useSelectedPostCommentsQuery>;
}

export const usePostCommentSectionState = ({
  selectedPostId,
  onRequireLogin,
  invalidatePostCaches,
  selectedPostCommentsQuery,
}: UsePostCommentSectionStateParams): PostCommentSectionControllerState => {
  const commentThread = useCommentThreadController({
    selectedPostId,
    onRequireLogin,
    invalidatePostCaches,
  });
  const errorMessage =
    selectedPostCommentsQuery.commentsQuery.error instanceof Error
      ? `댓글을 불러오지 못했어요. ${selectedPostCommentsQuery.commentsQuery.error.message}`
      : '댓글을 불러오지 못했어요.';

  return {
    sectionState: {
      isLoading: selectedPostCommentsQuery.commentsQuery.isLoading,
      isError: selectedPostCommentsQuery.commentsQuery.isError,
      errorMessage,
      comments: selectedPostCommentsQuery.selectedPostComments,
      composer: commentThread.composer,
      editor: commentThread.editor,
      reactions: commentThread.reactions,
    },
    actions: {
      resetTransientState: commentThread.resetCommentTransientState,
    },
  };
};
