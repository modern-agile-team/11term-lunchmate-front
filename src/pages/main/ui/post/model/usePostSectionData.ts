import { useQuery } from '@tanstack/react-query';
import { myUserQueryOptions } from '@/entities/user';
import type { PostSyncRequest } from './types';
import { useInfinitePosts } from './useInfinitePosts';
import { usePostComments } from './usePostComments';
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
  const infinitePosts = useInfinitePosts();
  const postSelection = usePostSelection({
    postItems: infinitePosts.postItems,
    selectedCategory: infinitePosts.selectedCategory,
    setSelectedCategory: infinitePosts.setSelectedCategory,
    postSyncRequest,
    onPostSyncHandled,
    myUserId: myUserData?.id ?? null,
  });
  const postComments = usePostComments({
    selectedPostId: postSelection.selectedPostId,
    myUserId: myUserData?.id ?? null,
  });

  return {
    infinitePosts,
    postSelection,
    postComments,
  };
};
