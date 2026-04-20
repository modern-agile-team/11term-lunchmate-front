import { Heart, MessageSquareText } from 'lucide-react';
import type { MainPostItem } from '@/entities/post';
import { formatRelativeCreatedAt } from '@/shared/lib/date/formatRelativeCreatedAt';
import { cn } from '@/shared/lib/classnames';
import { postCategoryStyleMap } from '../model/constants';

interface PostFeedProps {
  postsQuery: {
    isLoading: boolean;
    isError: boolean;
    error: unknown;
    isFetchingNextPage: boolean;
    hasNextPage?: boolean;
    isFetchNextPageError: boolean;
  };
  postItems: MainPostItem[];
  selectedPostId: number | null;
  onPostSelect: (postId: number) => void;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
}

const PostFeed = ({
  postsQuery,
  postItems,
  selectedPostId,
  onPostSelect,
  loadMoreRef,
}: PostFeedProps) => (
  <>
    {postsQuery.isLoading ? (
      <section className="rounded-[28px] border border-slate-200/80 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
        게시글을 불러오는 중...
      </section>
    ) : null}

    {postsQuery.isError ? (
      <section className="rounded-[28px] border border-rose-200 bg-rose-50 px-6 py-10 text-center text-sm text-rose-600 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
        게시글을 불러오지 못했어요.
        {postsQuery.error instanceof Error ? ` ${postsQuery.error.message}` : ''}
      </section>
    ) : null}

    {!postsQuery.isLoading && !postsQuery.isError && postItems.length === 0 ? (
      <section className="rounded-[28px] border border-slate-200/80 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
        아직 등록된 게시글이 없어요.
      </section>
    ) : null}

    {!postsQuery.isLoading && !postsQuery.isError
      ? postItems.map((postItem) => (
          <article
            key={postItem.id}
            className={cn(
              'cursor-pointer rounded-[28px] border bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] transition',
              selectedPostId === postItem.id
                ? 'border-indigo-200 ring-4 ring-indigo-100/60'
                : 'border-slate-200/80 hover:border-slate-300',
            )}
            onClick={() => onPostSelect(postItem.id)}
          >
            <div className="flex items-center justify-between gap-3">
              <span
                className={cn(
                  'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
                  postCategoryStyleMap[postItem.category],
                )}
              >
                {postItem.category}
              </span>
              <span className="text-sm text-slate-400">
                {formatRelativeCreatedAt(postItem.createdAt)}
              </span>
            </div>
            <h2 className="mt-4 text-[19px] font-bold tracking-[-0.03em] text-slate-900">
              {postItem.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{postItem.summary}</p>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
              <span className="font-medium text-slate-700">{postItem.author}</span>
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-1.5">
                  <Heart className="h-4 w-4 text-rose-400" />
                  {postItem.likedCount}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MessageSquareText className="h-4 w-4 text-indigo-500" />
                  {postItem.commentCount}
                </span>
              </div>
            </div>
          </article>
        ))
      : null}

    {!postsQuery.isLoading && !postsQuery.isError && postItems.length > 0 ? (
      <div className="space-y-3">
        {postsQuery.isFetchingNextPage ? (
          <section className="rounded-[24px] border border-slate-200/80 bg-white px-5 py-4 text-center text-sm text-slate-500 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
            게시글을 더 불러오는 중...
          </section>
        ) : null}

        {!postsQuery.hasNextPage ? (
          <section className="rounded-[24px] border border-slate-200/80 bg-white px-5 py-4 text-center text-sm text-slate-500 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
            마지막 게시글까지 모두 확인했어요.
          </section>
        ) : null}

        {postsQuery.isFetchNextPageError ? (
          <section className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-center text-sm text-rose-600 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
            게시글을 더 불러오지 못했어요.
          </section>
        ) : null}

        <div ref={loadMoreRef} className="h-1 w-full" aria-hidden="true" />
      </div>
    ) : null}
  </>
);

export default PostFeed;
