import { PencilLine, Trash2 } from 'lucide-react';
import type { MainPostComment } from '@/entities/comment';

interface CommentItemHeaderProps {
  comment: MainPostComment;
  onEditStart: (comment: MainPostComment) => void;
  onDeleteStart: (commentId: number) => void;
}

const CommentItemHeader = ({
  comment,
  onEditStart,
  onDeleteStart,
}: CommentItemHeaderProps) => (
  <div className="flex items-start justify-between gap-4">
    <div>
      <p className="font-semibold text-slate-800">{comment.author}</p>
      <p className="mt-1 text-xs text-slate-400">{comment.createdAt}</p>
    </div>
    {comment.isMine ? (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onEditStart(comment)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
        >
          <PencilLine className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onDeleteStart(comment.id)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-500 transition hover:bg-rose-100"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    ) : null}
  </div>
);

export default CommentItemHeader;
