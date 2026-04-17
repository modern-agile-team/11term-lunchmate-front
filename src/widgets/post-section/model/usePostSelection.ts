import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { postDetailQueryOptions } from '@/entities/post';

import type { MainPostCategoryFilter } from './constants';
import { toMainPostDetail } from './helpers';
import type { MainPostDetail, MainPostItem, PostSyncRequest } from './types';

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
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  useEffect(() => {
    if (!postSyncRequest) return;

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

  const postDetailQuery = useQuery({
    ...postDetailQueryOptions(effectiveSelectedPostId ?? 0),
    enabled: effectiveSelectedPostId !== null,
  });

  const selectedPostDetail: MainPostDetail | null =
    postDetailQuery.data && selectedPost
      ? toMainPostDetail(postDetailQuery.data, selectedPost.author)
      : null;

  const canEditSelectedPost =
    postDetailQuery.data !== undefined && myUserId === postDetailQuery.data.userId;

  const handleSelectPost = (postId: number) => {
    setSelectedPostId(postId);
  };

  return {
    selectedPostId: effectiveSelectedPostId,
    setSelectedPostId,
    selectedPost,
    postDetailQuery,
    selectedPostDetail,
    canEditSelectedPost,
    handleSelectPost,
  };
};
