import { Heart, MessageSquareText } from 'lucide-react';
import { PostCategoryBadge, type MainPostItem } from '@/entities/post';
import { cn } from '@/shared/lib/classnames';
import { formatRelativeCreatedAt } from '@/shared/lib/date/formatRelativeCreatedAt';

interface PostItemCardProps {
  postItem: MainPostItem;
  isSelected: boolean;
  onSelect: (postId: number) => void;
}

const PostItemCard = ({ postItem, isSelected, onSelect }: PostItemCardProps) => (
  <article
    className={cn(
      'cursor-pointer rounded-[28px] border bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] transition',
      isSelected
        ? 'border-indigo-200 ring-4 ring-indigo-100/60'
        : 'border-slate-200/80 hover:border-slate-300',
    )}
    onClick={() => onSelect(postItem.id)}
  >
    <div className="flex items-center justify-between gap-3">
      <PostCategoryBadge category={postItem.category} />
      <span className="text-sm text-slate-400">{formatRelativeCreatedAt(postItem.createdAt)}</span>
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
);

export default PostItemCard;
