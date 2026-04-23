import { useEffect, useMemo, useState } from 'react';
import type { MainPostItem, PostSyncRequest } from '@/entities/post';
import type { MainPostCategoryFilter } from './constants';

interface UsePostSelectionStateParams {
  postItems: MainPostItem[];
  selectedCategory: MainPostCategoryFilter;
  setSelectedCategory: (category: MainPostCategoryFilter) => void;
  postSyncRequest: PostSyncRequest | null;
  onPostSyncHandled: () => void;
}

export const usePostSelectionState = ({
  postItems,
  selectedCategory,
  setSelectedCategory,
  postSyncRequest,
  onPostSyncHandled,
}: UsePostSelectionStateParams) => {
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  useEffect(() => {
    if (!postSyncRequest) {
      return;
    }

    if (selectedCategory !== postSyncRequest.category) {
      setSelectedCategory(postSyncRequest.category);
    }

    onPostSyncHandled();
  }, [onPostSyncHandled, postSyncRequest, selectedCategory, setSelectedCategory]);

  const effectiveSelectedPostId = useMemo(() => {
    if (postItems.length === 0) {
      return null;
    }

    const syncedPostId = postSyncRequest?.postId ?? null;
    if (syncedPostId !== null) {
      const syncedExists = postItems.some((postItem) => postItem.id === syncedPostId);
      if (syncedExists) {
        return syncedPostId;
      }
    }

    const hasSelected =
      selectedPostId !== null && postItems.some((postItem) => postItem.id === selectedPostId);

    if (hasSelected) {
      return selectedPostId;
    }

    return postItems[0].id;
  }, [postItems, postSyncRequest, selectedPostId]);

  const selectedPost = useMemo(
    () => postItems.find((postItem) => postItem.id === effectiveSelectedPostId),
    [effectiveSelectedPostId, postItems],
  );

  return {
    selectedPostId: effectiveSelectedPostId,
    setSelectedPostId,
    selectedPost,
    handleSelectPost: (postId: number) => {
      setSelectedPostId(postId);
    },
  };
};
