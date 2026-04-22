import { useEffect, useMemo, useRef, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { roomInfiniteListQueryOptions, toMainRoom, toRoomListFilters } from '@/entities/room';
import { INITIAL_ROOM_FILTER_STATE, type RoomFilterState } from './constants';

const ROOM_LIST_DEFAULT_SIZE = 10;

export const useInfiniteRooms = () => {
  const roomListLoadMoreRef = useRef<HTMLDivElement | null>(null);
  const [roomFilterState, setRoomFilterState] = useState<RoomFilterState>(
    INITIAL_ROOM_FILTER_STATE,
  );

  const roomFilters = toRoomListFilters(roomFilterState);
  const roomsQuery = useInfiniteQuery(
    roomInfiniteListQueryOptions(roomFilters, ROOM_LIST_DEFAULT_SIZE),
  );

  const rooms = useMemo(
    () => roomsQuery.data?.pages.flatMap((page) => page.items).map(toMainRoom) ?? [],
    [roomsQuery.data],
  );
  const {
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isLoading,
  } = roomsQuery;

  useEffect(() => {
    const target = roomListLoadMoreRef.current;
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
    roomListLoadMoreRef,
    roomFilterState,
    setRoomFilterState,
    roomsQuery,
    rooms,
  };
};
