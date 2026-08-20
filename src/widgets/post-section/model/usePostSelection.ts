import type { PostSyncRequest } from '@/entities/post';
import { usePostSelectionState } from './usePostSelectionState';
import { useSelectedPostDetail } from './useSelectedPostDetail';

interface UsePostSelectionParams {
  postSyncRequest: PostSyncRequest | null;
  onPostSyncHandled: () => void;
}

export const usePostSelection = ({ postSyncRequest, onPostSyncHandled }: UsePostSelectionParams) => {
  const selectionState = usePostSelectionState({
    postSyncRequest,
    onPostSyncHandled,
  });
  const selectedPostDetailState = useSelectedPostDetail({
    selectedPostId: selectionState.selectedPostId,
  });

  return {
    ...selectionState,
    ...selectedPostDetailState,
  };
};
