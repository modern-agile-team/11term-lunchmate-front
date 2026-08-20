import { useEffect, useMemo, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { commentInfiniteListQueryOptions, toMainPostComment } from '@/entities/comment';

const COMMENT_LIST_DEFAULT_LIMIT = 10;

interface UsePostCommentsParams {
  selectedPostId: number | null;
}

export const useSelectedPostCommentsQuery = ({
  selectedPostId,
}: UsePostCommentsParams) => {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const commentsQuery = useInfiniteQuery({
    ...commentInfiniteListQueryOptions(selectedPostId ?? 0, {}, COMMENT_LIST_DEFAULT_LIMIT),
    enabled: selectedPostId !== null,
  });

  const selectedPostComments = useMemo(
    () =>
      selectedPostId === null
        ? []
        : (commentsQuery.data?.pages.flatMap((page) => page.items) ?? []).map((comment) =>
            toMainPostComment(comment, selectedPostId),
          ),
    [commentsQuery.data, selectedPostId],
  );

  const { fetchNextPage, hasNextPage, isError, isFetchingNextPage, isLoading } = commentsQuery;

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || isLoading || isError || !hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (!entry?.isIntersecting || isFetchingNextPage || !hasNextPage) return;
      void fetchNextPage();
    });

    observer.observe(target);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isError, isFetchingNextPage, isLoading]);

  return {
    commentsQuery,
    selectedPostComments,
    loadMoreRef,
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
  };
};
