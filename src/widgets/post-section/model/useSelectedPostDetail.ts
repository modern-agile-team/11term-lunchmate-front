import { useQuery } from '@tanstack/react-query';
import {
  postDetailQueryOptions,
  toMainPostDetail,
  type MainPostDetail,
  type MainPostItem,
} from '@/entities/post';

interface UseSelectedPostDetailParams {
  selectedPostId: number | null;
  selectedPost: MainPostItem | null | undefined;
  myUserId: number | null;
}

export const useSelectedPostDetail = ({
  selectedPostId,
  selectedPost,
  myUserId,
}: UseSelectedPostDetailParams) => {
  const postDetailQuery = useQuery({
    ...postDetailQueryOptions(selectedPostId ?? 0),
    enabled: selectedPostId !== null,
  });

  const selectedPostDetail: MainPostDetail | null =
    postDetailQuery.data && selectedPost
      ? toMainPostDetail(postDetailQuery.data, selectedPost.author)
      : null;

  const canEditSelectedPost =
    postDetailQuery.data !== undefined && myUserId === postDetailQuery.data.userId;

  return {
    postDetailQuery,
    selectedPostDetail,
    canEditSelectedPost,
  };
};
