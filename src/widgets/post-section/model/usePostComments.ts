import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { postCommentsQueryOptions } from '@/entities/comment';
import { COMMENTS_LIST_DEFAULT_PAGE, COMMENTS_LIST_DEFAULT_SIZE, toMainPostComment } from './helpers';

interface UsePostCommentsParams {
  selectedPostId: number | null;
  myUserId: number | null;
}

export const usePostComments = ({ selectedPostId, myUserId }: UsePostCommentsParams) => {
  const commentsQuery = useQuery({
    ...postCommentsQueryOptions(selectedPostId ?? 0, {
      page: COMMENTS_LIST_DEFAULT_PAGE,
      size: COMMENTS_LIST_DEFAULT_SIZE,
    }),
    enabled: selectedPostId !== null,
  });

  const selectedPostComments = useMemo(
    () =>
      selectedPostId === null
        ? []
        : (commentsQuery.data?.items ?? []).map((comment) =>
            toMainPostComment(comment, selectedPostId, myUserId),
          ),
    [commentsQuery.data?.items, myUserId, selectedPostId],
  );

  return {
    commentsQuery,
    selectedPostComments,
  };
};
