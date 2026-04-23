import { Heart, ThumbsDown } from 'lucide-react';
import type { MainPostDetail } from '@/entities/post';
import { cn } from '@/shared/lib/classnames';

interface PostReactionBarProps {
  selectedPostDetail: MainPostDetail;
  reactionErrorMessage: string;
  handlePostReaction: (type: 'like' | 'dislike') => Promise<void>;
  isLikePostPending: boolean;
  isDislikePostPending: boolean;
}

const PostReactionBar = ({
  selectedPostDetail,
  reactionErrorMessage,
  handlePostReaction,
  isLikePostPending,
  isDislikePostPending,
}: PostReactionBarProps) => (
  <>
    <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-5">
      <button
        type="button"
        onClick={() => void handlePostReaction('like')}
        disabled={isLikePostPending}
        className={cn(
          'inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition',
          selectedPostDetail.liked
            ? 'bg-rose-50 text-rose-600'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
        )}
      >
        <Heart className="h-4 w-4" />
        {selectedPostDetail.likedCount}
      </button>
      <button
        type="button"
        onClick={() => void handlePostReaction('dislike')}
        disabled={isDislikePostPending}
        className={cn(
          'inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition',
          selectedPostDetail.disliked
            ? 'bg-slate-900 text-white'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
        )}
      >
        <ThumbsDown className="h-4 w-4" />
        {selectedPostDetail.dislikeCount}
      </button>
    </div>
    {reactionErrorMessage ? (
      <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
        {reactionErrorMessage}
      </p>
    ) : null}
  </>
);

export default PostReactionBar;
