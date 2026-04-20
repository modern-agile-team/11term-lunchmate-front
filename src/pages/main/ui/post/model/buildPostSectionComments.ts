import type { PostSectionCommentsState } from './usePostSectionViewModel.types';

export const buildPostSectionComments = ({
  commentsQuery,
  selectedPostComments,
  commentActions,
}: PostSectionCommentsState) => ({
  commentsQuery,
  items: selectedPostComments,
  ...commentActions,
});
