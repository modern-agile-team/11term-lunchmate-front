import { useEffect, useMemo, useRef, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { postInfiniteListQueryOptions, toMainPostItem } from '@/entities/post';

const POST_LIST_DEFAULT_LIMIT = 10;

export const useInfinitePosts = () => {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const postsQuery = useInfiniteQuery(
    postInfiniteListQueryOptions(
      { categoryId: selectedCategoryId ?? undefined },
      POST_LIST_DEFAULT_LIMIT,
    ),
  );

  const postItems = useMemo(
    () => postsQuery.data?.pages.flatMap((page) => page.items).map(toMainPostItem) ?? [],
    [postsQuery.data],
  );
  const { fetchNextPage, hasNextPage, isError, isFetchingNextPage, isLoading } = postsQuery;

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
    loadMoreRef,
    selectedCategoryId,
    setSelectedCategoryId,
    postsQuery,
    postItems,
  };
};
