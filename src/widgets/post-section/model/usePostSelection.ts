import type { MainPostItem, PostSyncRequest } from '@/entities/post';
import type { MainPostCategoryFilter } from './constants';
import { usePostSelectionState } from './usePostSelectionState';
import { useSelectedPostDetail } from './useSelectedPostDetail';

interface UsePostSelectionParams {
  postItems: MainPostItem[];
  selectedCategory: MainPostCategoryFilter;
  setSelectedCategory: (category: MainPostCategoryFilter) => void;
  postSyncRequest: PostSyncRequest | null;
  onPostSyncHandled: () => void;
  myUserId: number | null;
}

export const usePostSelection = ({
  postItems,
  selectedCategory,
  setSelectedCategory,
  postSyncRequest,
  onPostSyncHandled,
  myUserId,
}: UsePostSelectionParams) => {
  const selectionState = usePostSelectionState({
    postItems,
    selectedCategory,
    setSelectedCategory,
    postSyncRequest,
    onPostSyncHandled,
  });
  const selectedPostDetailState = useSelectedPostDetail({
    selectedPostId: selectionState.selectedPostId,
    selectedPost: selectionState.selectedPost,
    myUserId,
  });

  return {
    ...selectionState,
    ...selectedPostDetailState,
  };
};
