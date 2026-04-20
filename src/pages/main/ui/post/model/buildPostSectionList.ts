import type { PostSectionListState } from './usePostSectionViewModel.types';

export const buildPostSectionList = ({
  loadMoreRef,
  postsQuery,
  postItems,
  selectedPostId,
  onPostSelect,
}: PostSectionListState) => ({
  loadMoreRef,
  postsQuery,
  postItems,
  selectedPostId,
  onPostSelect,
});
