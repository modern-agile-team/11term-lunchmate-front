import type { MainPostComment } from '@/entities/comment';
import CommentItem from './CommentItem';

type MessageTone = 'success' | 'error';

interface CommentListProps {
  comments: MainPostComment[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  editingCommentId: number | null;
  editingCommentValue: string;
  onEditingChange: (value: string) => void;
  onEditStart: (comment: MainPostComment) => void;
  onEditCancel: () => void;
  onEditSubmit: (comment: MainPostComment) => void;
  deletingCommentId: number | null;
  onDeleteStart: (commentId: number) => void;
  onDeleteCancel: () => void;
  onDeleteConfirm: (comment: MainPostComment) => void;
  onLike: (comment: MainPostComment) => void;
  onDislike: (comment: MainPostComment) => void;
  likingCommentId: number | null;
  dislikingCommentId: number | null;
  editMessage: string;
  editTone: MessageTone;
  deleteMessage: string;
  deleteTone: MessageTone;
}

const CommentList = ({
  comments,
  isLoading,
  isError,
  errorMessage,
  ...commentItemProps
}: CommentListProps) => {
  if (isLoading) {
    return (
      <div className="rounded-[24px] bg-slate-50 px-5 py-8 text-center text-sm text-slate-500">
        댓글을 불러오는 중...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-8 text-center text-sm text-rose-600">
        {errorMessage}
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
        <CommentItem key={comment.id} comment={comment} {...commentItemProps} />
      ))}
    </>
  );
};

export default CommentList;
