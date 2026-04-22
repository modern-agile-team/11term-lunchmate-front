import { useQuery } from '@tanstack/react-query';
import { myUserQueryOptions } from '@/entities/user';
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
  const { data: myUserData } = useQuery(myUserQueryOptions());
  const myUserId = myUserData?.id ?? null;
  const infinitePosts = useInfinitePosts();
  const postSelection = usePostSelection({
    postItems: infinitePosts.postItems,
    selectedCategory: infinitePosts.selectedCategory,
    setSelectedCategory: infinitePosts.setSelectedCategory,
    postSyncRequest,
    onPostSyncHandled,
    myUserId,
  });
  const selectedPostCommentsQuery = useSelectedPostCommentsQuery({
    selectedPostId: postSelection.selectedPostId,
    myUserId,
  });

  return {
    infinitePosts,
    postSelection,
    selectedPostCommentsQuery,
  };
};
