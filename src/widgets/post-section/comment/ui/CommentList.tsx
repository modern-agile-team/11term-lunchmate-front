import type { MainPostComment } from '@/entities/comment';
import type {
  CommentItemActions,
  CommentItemState,
  CommentListViewState,
} from '../model/types';
import CommentItem from './CommentItem';

interface CommentListProps {
  comments: MainPostComment[];
  viewState: CommentListViewState;
  itemState: CommentItemState;
  itemActions: CommentItemActions;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

const CommentList = ({
  comments,
  viewState,
  itemState,
  itemActions,
  loadMoreRef,
  hasNextPage,
  isFetchingNextPage,
}: CommentListProps) => {
  if (viewState.isLoading) {
    return (
      <div className="rounded-[24px] bg-slate-50 px-5 py-8 text-center text-sm text-slate-500">
        댓글을 불러오는 중...
      </div>
    );
  }

  if (viewState.isError) {
    return (
      <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-8 text-center text-sm text-rose-600">
        {viewState.errorMessage}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="rounded-[24px] bg-slate-50 px-5 py-8 text-center text-sm text-slate-500">
        아직 댓글이 없어요.
      </div>
    );
  }

  return (
    <>
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          state={itemState}
          actions={itemActions}
        />
      ))}
      {hasNextPage ? (
        <div ref={loadMoreRef} className="h-1 w-full" aria-hidden="true" />
      ) : null}
      {isFetchingNextPage ? (
        <p className="text-center text-xs text-slate-400">댓글을 더 불러오는 중...</p>
      ) : null}
    </>
  );
};

export default CommentList;
