import { useEffect, useState } from 'react';
import type { PostSyncRequest } from '@/entities/post';

interface UsePostSelectionStateParams {
  postSyncRequest: PostSyncRequest | null;
  onPostSyncHandled: () => void;
}

export const usePostSelectionState = ({
  postSyncRequest,
  onPostSyncHandled,
}: UsePostSelectionStateParams) => {
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  useEffect(() => {
    if (!postSyncRequest) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedPostId(postSyncRequest.postId);
    onPostSyncHandled();
  }, [onPostSyncHandled, postSyncRequest]);

  return {
    selectedPostId,
    setSelectedPostId,
    handleSelectPost: (postId: number) => {
      setSelectedPostId(postId);
    },
  };
};
