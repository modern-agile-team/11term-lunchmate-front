import { useEffect, useMemo, useRef, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

import { postInfiniteListQueryOptions } from '@/entities/post';

import { type MainPostCategoryFilter, postCategoryIdMap } from './constants';
import { POST_LIST_DEFAULT_PAGE, POST_LIST_DEFAULT_SIZE, toMainPostItem } from './helpers';

export const useInfinitePosts = () => {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<MainPostCategoryFilter>('ALL');

  const categoryId = selectedCategory === 'ALL' ? undefined : postCategoryIdMap[selectedCategory];
  const postsQuery = useInfiniteQuery(
    postInfiniteListQueryOptions({
      page: POST_LIST_DEFAULT_PAGE,
      size: POST_LIST_DEFAULT_SIZE,
      categoryId,
    }),
  );

  const postItems = useMemo(
    () => postsQuery.data?.pages.flatMap((page) => page.items).map(toMainPostItem) ?? [],
    [postsQuery.data],
  );
  const {
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isLoading,
  } = postsQuery;

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
    selectedCategory,
    setSelectedCategory,
    postsQuery,
    postItems,
  };
};
