import { Heart, MessageSquareText, PencilLine } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  postQueries,
  type PostDetailResponse,
  type PostListItemResponse,
} from '@/shared/api/posts';
import { myUserQueryOptions } from '@/shared/api/users/meQueries';
import { cn } from '@/shared/lib/utils';
import type { MainBoardPost, MainBoardPostSyncRequest } from './types';
import {
  boardCategoryFilterOptions,
  boardCategoryIdLabelMap,
  boardCategoryIdMap,
  boardCategoryStyleMap,
  type MainBoardCategoryFilter,
} from './board.constants';
import CreatePostModal, { type CreatePostFormValues } from './CreatePostModal';

const BOARD_LIST_DEFAULT_PAGE = 1;
const BOARD_LIST_DEFAULT_SIZE = 10;

const formatRelativeCreatedAt = (createdAt: string) => {
  const currentTime = Date.now();
  const createdTime = new Date(createdAt).getTime();
  const diffMinutes = Math.max(1, Math.floor((currentTime - createdTime) / (1000 * 60)));

  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }

  const diffDays = Math.floor(diffHours / 24);

  return `${diffDays}일 전`;
};

const toBoardCategory = (
  post:
    | Pick<PostListItemResponse, 'category' | 'categoryId'>
    | Pick<PostDetailResponse, 'category' | 'categoryId'>,
): MainBoardPost['category'] => {
  if (
    post.category === 'FREE' ||
    post.category === 'REVIEW' ||
    post.category === 'INFO' ||
    post.category === 'TALK'
  ) {
    return post.category;
  }

  if (post.categoryId !== undefined && post.categoryId !== null) {
    return boardCategoryIdLabelMap[post.categoryId] ?? 'FREE';
  }

  return 'FREE';
};

const toBoardAuthor = (post: PostListItemResponse) =>
  post.author?.trim() ||
  post.authorNickname?.trim() ||
  post.userNickname?.trim() ||
  post.nickname?.trim() ||
  post.user?.nickname?.trim() ||
  post.user?.name?.trim() ||
  '익명 사용자';

const toBoardSummary = (post: PostListItemResponse) => {
  const sourceText = post.summary?.trim() || post.content?.trim() || '';

  if (sourceText === '') {
    return '게시글 요약이 아직 없어요.';
  }

  if (sourceText.length <= 90) {
    return sourceText;
  }

  return `${sourceText.slice(0, 90).trimEnd()}...`;
};

const toMainBoardPost = (post: PostListItemResponse): MainBoardPost => ({
  id: post.id,
  category: toBoardCategory(post),
  title: post.title,
  author: toBoardAuthor(post),
  summary: toBoardSummary(post),
  content: post.content ?? '',
  likedCount: post.likeCount ?? 0,
  commentCount: post.commentCount ?? 0,
  createdAt: post.createdAt,
});

const toMainBoardPostDetail = (
  post: PostDetailResponse,
  author: string,
): MainBoardPost => ({
  id: post.id,
  category: toBoardCategory(post),
  title: post.title,
  author,
  summary: post.content,
  content: post.content,
  likedCount: post.likeCount ?? 0,
  commentCount: post.commentCount ?? 0,
  createdAt: post.createdAt,
});

const toEditPostFormValues = (post: MainBoardPost): CreatePostFormValues => ({
  category: post.category,
  title: post.title,
  content: post.content,
});

interface MainBoardSectionProps {
  postSyncRequest: MainBoardPostSyncRequest | null;
  onPostSyncHandled: () => void;
  onRequireLogin: () => void;
}

const MainBoardSection = ({
  postSyncRequest,
  onPostSyncHandled,
  onRequireLogin,
}: MainBoardSectionProps) => {
  const [selectedBoardPostId, setSelectedBoardPostId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<MainBoardCategoryFilter>('ALL');
  const [pendingSyncedPostId, setPendingSyncedPostId] = useState<number | null>(null);
  const [isEditPostModalOpen, setIsEditPostModalOpen] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const categoryId =
    selectedCategory === 'ALL' ? undefined : boardCategoryIdMap[selectedCategory];
  const { data: myUserData } = useQuery(myUserQueryOptions());
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useInfiniteQuery(
    postQueries.infiniteList({
      page: BOARD_LIST_DEFAULT_PAGE,
      size: BOARD_LIST_DEFAULT_SIZE,
      categoryId,
    }),
  );
  const boardPosts = useMemo(
    () => data?.pages.flatMap((page) => page.items).map(toMainBoardPost) ?? [],
    [data],
  );
  const selectedBoardPost = boardPosts.find((boardPost) => boardPost.id === selectedBoardPostId);
  const {
    data: selectedBoardPostDetailData,
    isLoading: isBoardDetailLoading,
    isError: isBoardDetailError,
    error: boardDetailError,
  } = useQuery({
    ...postQueries.detail(selectedBoardPostId ?? 0),
    enabled: selectedBoardPostId !== null,
  });
  const selectedBoardPostDetail =
    selectedBoardPostDetailData && selectedBoardPost
      ? toMainBoardPostDetail(selectedBoardPostDetailData, selectedBoardPost.author)
      : null;
  const canEditSelectedPost =
    selectedBoardPostDetailData !== undefined && myUserData?.id === selectedBoardPostDetailData.userId;
  const hasLoadedPosts = data !== undefined;

  useEffect(() => {
    if (!postSyncRequest) {
      return;
    }

    if (selectedCategory !== 'ALL' && selectedCategory !== postSyncRequest.category) {
      setSelectedCategory(postSyncRequest.category);
    }

    setPendingSyncedPostId(postSyncRequest.postId);
    setSelectedBoardPostId(postSyncRequest.postId);
    onPostSyncHandled();
  }, [onPostSyncHandled, postSyncRequest, selectedCategory]);

  useEffect(() => {
    if (boardPosts.length === 0) {
      if (pendingSyncedPostId !== null && isFetching) {
        return;
      }

      setSelectedBoardPostId(null);
      return;
    }

    if (pendingSyncedPostId !== null) {
      const hasPendingSyncedPost = boardPosts.some(
        (boardPost) => boardPost.id === pendingSyncedPostId,
      );

      if (hasPendingSyncedPost) {
        setSelectedBoardPostId(pendingSyncedPostId);
        setPendingSyncedPostId(null);
        return;
      }

      if (isFetching) {
        return;
      }
    }

    const hasSelectedBoardPost =
      selectedBoardPostId !== null &&
      boardPosts.some((boardPost) => boardPost.id === selectedBoardPostId);

    if (!hasSelectedBoardPost) {
      setSelectedBoardPostId(boardPosts[0].id);
    }
  }, [boardPosts, isFetching, pendingSyncedPostId, selectedBoardPostId]);

  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target || isLoading || isError || !hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;

      if (!entry?.isIntersecting || isFetchingNextPage || !hasNextPage) {
        return;
      }

      void fetchNextPage();
    });

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isError, isFetchingNextPage, isLoading]);

  return (
    <section className="space-y-4 md:space-y-5">
      <section className="rounded-[28px] border border-slate-200/80 bg-white px-5 py-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] md:px-6">
        <div>
          <p className="text-sm font-semibold text-slate-700">카테고리</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {boardCategoryFilterOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSelectedCategory(option.value)}
                className={cn(
                  'rounded-2xl px-4 py-2.5 text-sm font-semibold transition',
                  selectedCategory === option.value
                    ? 'bg-slate-900 text-white'
                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {isLoading ? (
        <section className="rounded-[28px] border border-slate-200/80 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
          게시글을 불러오는 중...
        </section>
      ) : null}

      {isError ? (
        <section className="rounded-[28px] border border-rose-200 bg-rose-50 px-6 py-10 text-center text-sm text-rose-600 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
          게시글을 불러오지 못했어요.
          {error instanceof Error ? ` ${error.message}` : ''}
        </section>
      ) : null}

      {!isLoading && !isError && boardPosts.length === 0 ? (
        <section className="rounded-[28px] border border-slate-200/80 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
          아직 등록된 게시글이 없어요.
        </section>
      ) : null}

      {!isLoading && !isError
        ? boardPosts.map((boardPost) => (
            <article
              key={boardPost.id}
              className={cn(
                'cursor-pointer rounded-[28px] border bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] transition',
                selectedBoardPostId === boardPost.id
                  ? 'border-indigo-200 ring-4 ring-indigo-100/60'
                  : 'border-slate-200/80 hover:border-slate-300',
              )}
              onClick={() => setSelectedBoardPostId(boardPost.id)}
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className={cn(
                    'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
                    boardCategoryStyleMap[boardPost.category],
                  )}
                >
                  {boardPost.category}
                </span>
                <span className="text-sm text-slate-400">
                  {formatRelativeCreatedAt(boardPost.createdAt)}
                </span>
              </div>

              <h2 className="mt-4 text-[19px] font-bold tracking-[-0.03em] text-slate-900">
                {boardPost.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{boardPost.summary}</p>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
                <span className="font-medium text-slate-700">{boardPost.author}</span>

                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center gap-1.5">
                    <Heart className="h-4 w-4 text-rose-400" />
                    {boardPost.likedCount}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MessageSquareText className="h-4 w-4 text-indigo-500" />
                    {boardPost.commentCount}
                  </span>
                </div>
              </div>
            </article>
          ))
        : null}

      {!isLoading && !isError && boardPosts.length > 0 ? (
        <div className="space-y-3">
          {isFetchingNextPage ? (
            <section className="rounded-[24px] border border-slate-200/80 bg-white px-5 py-4 text-center text-sm text-slate-500 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
              게시글을 더 불러오는 중...
            </section>
          ) : null}

          {!hasNextPage && hasLoadedPosts ? (
            <section className="rounded-[24px] border border-slate-200/80 bg-white px-5 py-4 text-center text-sm text-slate-500 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
              마지막 게시글까지 모두 확인했어요.
            </section>
          ) : null}

          {isFetchNextPageError ? (
            <section className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-center text-sm text-rose-600 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
              게시글을 더 불러오지 못했어요.
            </section>
          ) : null}

          <div ref={loadMoreRef} className="h-1 w-full" aria-hidden="true" />
        </div>
      ) : null}

      {selectedBoardPost && !isLoading && !isError ? (
        <article className="rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] md:p-7">
          {isBoardDetailLoading ? (
            <div className="rounded-[24px] bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
              게시글 상세를 불러오는 중...
            </div>
          ) : null}

          {isBoardDetailError ? (
            <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-10 text-center text-sm text-rose-600">
              게시글 상세를 불러오지 못했어요.
              {boardDetailError instanceof Error ? ` ${boardDetailError.message}` : ''}
            </div>
          ) : null}

          {selectedBoardPostDetail && !isBoardDetailLoading && !isBoardDetailError ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
                      boardCategoryStyleMap[selectedBoardPostDetail.category],
                    )}
                  >
                    {selectedBoardPostDetail.category}
                  </span>
                  <span className="text-sm text-slate-400">
                    {formatRelativeCreatedAt(selectedBoardPostDetail.createdAt)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <Heart className="h-4 w-4 text-rose-400" />
                      {selectedBoardPostDetail.likedCount}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MessageSquareText className="h-4 w-4 text-indigo-500" />
                      {selectedBoardPostDetail.commentCount}
                    </span>
                  </div>

                  {canEditSelectedPost ? (
                    <button
                      type="button"
                      onClick={() => setIsEditPostModalOpen(true)}
                      className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                      <PencilLine className="h-4 w-4" />
                      게시글 수정
                    </button>
                  ) : null}
                </div>
              </div>

              <h3 className="mt-5 text-[24px] font-bold tracking-[-0.03em] text-slate-900">
                {selectedBoardPostDetail.title}
              </h3>
              <p className="mt-2 text-sm font-medium text-slate-500">
                {selectedBoardPostDetail.author}
              </p>

              <div className="mt-4 text-xs font-medium text-slate-400">
                조회 {selectedBoardPostDetailData?.viewCount ?? 0}
              </div>

              <div className="mt-6 whitespace-pre-line rounded-[24px] bg-slate-50 px-5 py-5 text-sm leading-7 text-slate-600">
                {selectedBoardPostDetail.content}
              </div>

              <div className="mt-6 rounded-[24px] bg-slate-50 px-5 py-5 text-sm leading-7 text-slate-600">
                댓글과 게시글 액션은 다음 이슈에서 연결 예정이에요.
              </div>
            </>
          ) : null}
        </article>
      ) : null}

      {selectedBoardPostDetail ? (
        <CreatePostModal
          isOpen={isEditPostModalOpen}
          mode="edit"
          postId={selectedBoardPostDetail.id}
          initialValues={toEditPostFormValues(selectedBoardPostDetail)}
          onClose={() => setIsEditPostModalOpen(false)}
          onRequireLogin={onRequireLogin}
          onSuccess={(post) => {
            setPendingSyncedPostId(post.postId);
            setSelectedBoardPostId(post.postId);

            if (selectedCategory !== 'ALL' && selectedCategory !== post.category) {
              setSelectedCategory(post.category);
            }
          }}
        />
      ) : null}
    </section>
  );
};

export default MainBoardSection;
