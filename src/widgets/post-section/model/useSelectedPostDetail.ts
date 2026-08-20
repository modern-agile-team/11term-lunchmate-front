import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  increasePostViewCount,
  postDetailQueryOptions,
  postQueryKeys,
  toMainPostDetail,
  type MainPostDetail,
  type PostDetailResponse,
} from '@/entities/post';

interface UseSelectedPostDetailParams {
  selectedPostId: number | null;
}

export const useSelectedPostDetail = ({ selectedPostId }: UseSelectedPostDetailParams) => {
  const queryClient = useQueryClient();
  const postDetailQuery = useQuery({
    ...postDetailQueryOptions(selectedPostId ?? 0),
    enabled: selectedPostId !== null,
  });

  const viewCountMutation = useMutation({
    mutationFn: increasePostViewCount,
    onSuccess: (result, postId) => {
      queryClient.setQueryData<PostDetailResponse>(
        postQueryKeys.detail(postId),
        (current) => (current ? { ...current, viewCount: result.viewCount } : current),
      );

      void queryClient.invalidateQueries({
        queryKey: postQueryKeys.lists(),
      });
    },
  });

  useEffect(() => {
    if (selectedPostId !== null) {
      viewCountMutation.mutate(selectedPostId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPostId]);

  const selectedPostDetail: MainPostDetail | null = postDetailQuery.data
    ? toMainPostDetail(postDetailQuery.data)
    : null;

  const canEditSelectedPost = postDetailQuery.data?.isMine ?? false;

  return {
    postDetailQuery,
    selectedPostDetail,
    canEditSelectedPost,
  };
};
