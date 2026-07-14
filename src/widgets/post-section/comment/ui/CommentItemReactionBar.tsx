import { Heart } from 'lucide-react';
import type { MainPostComment } from '@/entities/comment';
import { cn } from '@/shared/lib/classnames';

interface CommentItemReactionBarProps {
  comment: MainPostComment;
  isLiking: boolean;
  onLike: () => void;
}

const CommentItemReactionBar = ({ comment, isLiking, onLike }: CommentItemReactionBarProps) => (
  <div className="mt-4 flex items-center gap-3">
    <button
      type="button"
      onClick={onLike}
      disabled={isLiking}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-2xl px-3 py-2 text-sm font-medium transition',
        comment.liked
          ? 'bg-rose-50 text-rose-600'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
      )}
    >
      <Heart className="h-4 w-4" />
      {isLiking ? '반영 중...' : comment.likedCount}
    </button>
  </div>
);

export default CommentItemReactionBar;
