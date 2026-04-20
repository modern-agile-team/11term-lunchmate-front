import type { MainPostComment } from '@/entities/comment';
import { cn } from '@/shared/lib/classnames';
import CommentDeleteConfirm from './CommentDeleteConfirm';
import CommentItemBody from './CommentItemBody';
import CommentItemEditor from './CommentItemEditor';
import CommentItemHeader from './CommentItemHeader';
import CommentItemReactionBar from './CommentItemReactionBar';

type MessageTone = 'success' | 'error';

interface CommentItemProps {
  comment: MainPostComment;
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

const messageClassName = (tone: MessageTone) =>
  cn(
    'mt-4 rounded-2xl border px-4 py-3 text-sm',
    tone === 'error'
      ? 'border-rose-200 bg-rose-50 text-rose-600'
      : 'border-emerald-200 bg-emerald-50 text-emerald-700',
  );

const CommentItem = ({
  comment,
  editingCommentId,
  editingCommentValue,
  onEditingChange,
  onEditStart,
  onEditCancel,
  onEditSubmit,
  deletingCommentId,
  onDeleteStart,
  onDeleteCancel,
  onDeleteConfirm,
  onLike,
  onDislike,
  likingCommentId,
  dislikingCommentId,
  editMessage,
  editTone,
  deleteMessage,
  deleteTone,
}: CommentItemProps) => {
  const isEditing = editingCommentId === comment.id;
  const isDeleting = deletingCommentId === comment.id;
  const isLiking = likingCommentId === comment.id;
  const isDisliking = dislikingCommentId === comment.id;

  return (
    <article className="rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
      <CommentItemHeader
        comment={comment}
        onEditStart={onEditStart}
        onDeleteStart={onDeleteStart}
      />

      {isEditing ? (
        <CommentItemEditor
          comment={comment}
          editingCommentValue={editingCommentValue}
          onEditingChange={onEditingChange}
          onEditCancel={onEditCancel}
          onEditSubmit={onEditSubmit}
        />
      ) : (
        <CommentItemBody comment={comment} />
      )}

      {isEditing && editMessage ? <p className={messageClassName(editTone)}>{editMessage}</p> : null}
      {isDeleting && deleteMessage ? (
        <p className={messageClassName(deleteTone)}>{deleteMessage}</p>
      ) : null}

      {isDeleting ? (
        <CommentDeleteConfirm
          onCancel={onDeleteCancel}
          onConfirm={() => onDeleteConfirm(comment)}
        />
      ) : null}

      <CommentItemReactionBar
        comment={comment}
        isLiking={isLiking}
        isDisliking={isDisliking}
        onLike={onLike}
        onDislike={onDislike}
      />
    </article>
  );
};

export default CommentItem;
