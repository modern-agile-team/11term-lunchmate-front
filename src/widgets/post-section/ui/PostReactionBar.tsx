import { Heart } from 'lucide-react';
import type { MainPostDetail } from '@/entities/post';
import { cn } from '@/shared/lib/classnames';

interface PostReactionBarProps {
  selectedPostDetail: MainPostDetail;
  reactionErrorMessage: string;
  handlePostReaction: () => Promise<void>;
  isLikePostPending: boolean;
}

const PostReactionBar = ({
  selectedPostDetail,
  reactionErrorMessage,
  handlePostReaction,
  isLikePostPending,
}: PostReactionBarProps) => (
  <>
    <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-5">
      <button
        type="button"
        onClick={() => void handlePostReaction()}
        disabled={isLikePostPending}
        className={cn(
          'inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition',
          selectedPostDetail.liked
            ? 'bg-rose-50 text-rose-600'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
        )}
      >
        <Heart className="h-4 w-4" />
        {selectedPostDetail.likeCount}
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
