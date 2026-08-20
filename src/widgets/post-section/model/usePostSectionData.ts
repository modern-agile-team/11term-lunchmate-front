import type { PostSyncRequest } from '@/entities/post';
import { useInfinitePosts } from './useInfinitePosts';
import { useSelectedPostCommentsQuery } from './useSelectedPostCommentsQuery';
import { usePostSelection } from './usePostSelection';

interface UsePostSectionDataParams {
  postSyncRequest: PostSyncRequest | null;
  onPostSyncHandled: () => void;
}

export const usePostSectionData = ({
  postSyncRequest,
  onPostSyncHandled,
}: UsePostSectionDataParams) => {
  const infinitePosts = useInfinitePosts();
  const postSelection = usePostSelection({
    postSyncRequest,
    onPostSyncHandled,
  });
  const selectedPostCommentsQuery = useSelectedPostCommentsQuery({
    selectedPostId: postSelection.selectedPostId,
  });

  return {
    infinitePosts,
    postSelection,
    selectedPostCommentsQuery,
  };
};
