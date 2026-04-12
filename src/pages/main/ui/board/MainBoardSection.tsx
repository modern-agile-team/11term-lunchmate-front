import { Heart, MessageSquareText, Pencil, SendHorizonal, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { isAuthenticated } from '@/app/authSessionStore';
import { commentQueries, type CommentListItemResponse } from '@/shared/api/comments';
import { myUserQueryOptions } from '@/shared/api/users/meQueries';
import { cn } from '@/shared/lib/utils';
import type { MainBoardComment } from './types';
import { mockBoardPosts } from './mockBoardPosts';

const COMMENTS_LIST_DEFAULT_PAGE = 1;
const COMMENTS_LIST_DEFAULT_SIZE = 20;

const categoryStyleMap = {
  FREE: 'bg-slate-100 text-slate-600',
  REVIEW: 'bg-amber-50 text-amber-700',
  INFO: 'bg-sky-50 text-sky-700',
  TALK: 'bg-violet-50 text-violet-700',
} as const;

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

const toBoardCommentAuthor = (comment: CommentListItemResponse) =>
  comment.author?.trim() ||
  comment.authorNickname?.trim() ||
  comment.userNickname?.trim() ||
  comment.nickname?.trim() ||
  comment.user?.nickname?.trim() ||
  '익명 사용자';

const toMainBoardComment = (
  comment: CommentListItemResponse,
  postId: number,
  currentUserId: number | null,
): MainBoardComment => ({
  id: comment.id,
  postId: comment.postId ?? postId,
  author: toBoardCommentAuthor(comment),
  content: comment.content,
  likedCount: comment.likeCount ?? 0,
  createdAt: comment.createdAt,
  isMine:
    typeof comment.isMine === 'boolean'
      ? comment.isMine
      : currentUserId !== null &&
        (comment.userId === currentUserId || comment.authorId === currentUserId),
});

const MainBoardSection = () => {
  const initialSelectedBoardPostId = mockBoardPosts[0]?.id ?? null;
  const [selectedBoardPostId, setSelectedBoardPostId] = useState<number | null>(
    initialSelectedBoardPostId,
  );
  const selectedBoardPost = mockBoardPosts.find(
    (mockBoardPost) => mockBoardPost.id === selectedBoardPostId,
  );
  const isLoggedIn = isAuthenticated();
  const { data: currentUser } = useQuery({
    ...myUserQueryOptions(),
    enabled: isLoggedIn,
  });
  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
    error: commentsError,
  } = useQuery({
    ...commentQueries.list(selectedBoardPostId ?? 0, {
      page: COMMENTS_LIST_DEFAULT_PAGE,
      size: COMMENTS_LIST_DEFAULT_SIZE,
    }),
    enabled: selectedBoardPostId !== null,
  });

  const selectedBoardComments = useMemo(
    () =>
      selectedBoardPostId === null
        ? []
        : (commentsData?.items ?? []).map((comment) =>
            toMainBoardComment(comment, selectedBoardPostId, currentUser?.id ?? null),
          ),
    [commentsData?.items, currentUser?.id, selectedBoardPostId],
  );

  return (
    <section className="space-y-4 md:space-y-5">
      {mockBoardPosts.map((mockBoardPost) => (
        <article
          key={mockBoardPost.id}
          className={cn(
            'cursor-pointer rounded-[28px] border bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] transition',
            selectedBoardPostId === mockBoardPost.id
              ? 'border-indigo-200 ring-4 ring-indigo-100/60'
              : 'border-slate-200/80 hover:border-slate-300',
          )}
          onClick={() => setSelectedBoardPostId(mockBoardPost.id)}
        >
          <div className="flex items-center justify-between gap-3">
            <span
              className={cn(
                'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
                categoryStyleMap[mockBoardPost.category],
              )}
            >
              {mockBoardPost.category}
            </span>
            <span className="text-sm text-slate-400">
              {formatRelativeCreatedAt(mockBoardPost.createdAt)}
            </span>
          </div>

          <h2 className="mt-4 text-[19px] font-bold tracking-[-0.03em] text-slate-900">
            {mockBoardPost.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">{mockBoardPost.summary}</p>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
            <span className="font-medium text-slate-700">{mockBoardPost.author}</span>

            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <Heart className="h-4 w-4 text-rose-400" />
                {mockBoardPost.likedCount}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MessageSquareText className="h-4 w-4 text-indigo-500" />
                {mockBoardPost.commentCount}
              </span>
            </div>
          </div>
        </article>
      ))}

      {selectedBoardPost ? (
        <article className="rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
                  categoryStyleMap[selectedBoardPost.category],
                )}
              >
                {selectedBoardPost.category}
              </span>
              <span className="text-sm text-slate-400">
                {formatRelativeCreatedAt(selectedBoardPost.createdAt)}
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 text-sm text-slate-500">
              <Heart className="h-4 w-4 text-rose-400" />
              {selectedBoardPost.likedCount}
            </div>
          </div>

          <h3 className="mt-5 text-[24px] font-bold tracking-[-0.03em] text-slate-900">
            {selectedBoardPost.title}
          </h3>
          <p className="mt-2 text-sm font-medium text-slate-500">{selectedBoardPost.author}</p>

          <div className="mt-6 whitespace-pre-line rounded-[24px] bg-slate-50 px-5 py-5 text-sm leading-7 text-slate-600">
            {selectedBoardPost.content}
          </div>

          <section className="mt-8">
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-lg font-bold tracking-[-0.03em] text-slate-900">
                댓글 {selectedBoardPost.commentCount}
              </h4>
              <span className="text-sm text-slate-400">목록 조회 연결</span>
            </div>

            <div className="mt-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">댓글 작성</span>
                <textarea
                  disabled
                  placeholder="댓글 작성은 다음 이슈에서 연결 예정이에요."
                  className="mt-3 min-h-[110px] w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500 outline-none"
                />
              </label>

              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-xs font-medium text-slate-400">댓글 작성은 #85에서 연결 예정이에요.</p>

                <button
                  type="button"
                  disabled
                  className="inline-flex cursor-not-allowed items-center gap-2 rounded-2xl bg-slate-300 px-4 py-3 text-sm font-semibold text-white"
                >
                  <SendHorizonal className="h-4 w-4" />
                  댓글 등록
                </button>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {isCommentsLoading ? (
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-6 text-center text-sm text-slate-500">
                  댓글을 불러오는 중...
                </div>
              ) : null}

              {isCommentsError ? (
                <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-6 text-center text-sm text-rose-600">
                  댓글을 불러오지 못했어요.
                  {commentsError instanceof Error ? ` ${commentsError.message}` : ''}
                </div>
              ) : null}

              {!isCommentsLoading && !isCommentsError && selectedBoardComments.length === 0 ? (
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-6 text-center text-sm text-slate-500">
                  아직 등록된 댓글이 없어요.
                </div>
              ) : null}

              {!isCommentsLoading && !isCommentsError
                ? selectedBoardComments.map((selectedBoardComment) => (
                    <article
                      key={selectedBoardComment.id}
                      className="rounded-[24px] border border-slate-200/80 bg-white px-5 py-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            {selectedBoardComment.author}
                          </div>
                          <div className="mt-1 text-xs text-slate-400">
                            {formatRelativeCreatedAt(selectedBoardComment.createdAt)}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-xs font-medium text-slate-400">
                          <span className="inline-flex items-center gap-1">
                            <Heart className="h-3.5 w-3.5 text-rose-400" />
                            {selectedBoardComment.likedCount}
                          </span>

                          {selectedBoardComment.isMine ? (
                            <>
                              <button
                                type="button"
                                disabled
                                className="inline-flex cursor-not-allowed items-center gap-1 opacity-60"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                수정
                              </button>
                              <button
                                type="button"
                                disabled
                                className="inline-flex cursor-not-allowed items-center gap-1 opacity-60"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                삭제
                              </button>
                            </>
                          ) : null}
                        </div>
                      </div>

                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {selectedBoardComment.content}
                      </p>

                      <p className="mt-3 text-xs font-medium text-slate-400">
                        댓글 좋아요는 #88, 수정은 #86, 삭제는 #87에서 연결 예정이에요.
                      </p>
                    </article>
                  ))
                : null}
            </div>
          </section>
        </article>
      ) : null}
    </section>
  );
};

export default MainBoardSection;
