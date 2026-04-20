import type { QueryClient } from '@tanstack/react-query';
import { useCommentActions } from './useCommentActions';
import type { usePostComments } from './usePostComments';

interface UsePostSectionCommentsParams {
  selectedPostId: number | null;
  onRequireLogin: () => void;
  invalidatePostCaches: (postId: number) => Promise<unknown>;
  queryClient: QueryClient;
  postComments: ReturnType<typeof usePostComments>;
}

export const usePostSectionComments = ({
  selectedPostId,
  onRequireLogin,
  invalidatePostCaches,
  queryClient,
  postComments,
}: UsePostSectionCommentsParams) => {
  const commentActions = useCommentActions({
    selectedPostId,
    onRequireLogin,
    invalidatePostCaches,
    queryClient,
  });

  return {
    commentsQuery: postComments.commentsQuery,
    selectedPostComments: postComments.selectedPostComments,
    commentActions,
    resetCommentTransientState: commentActions.resetCommentTransientState,
  };
};
