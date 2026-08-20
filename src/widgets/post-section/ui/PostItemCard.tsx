import { Eye, Heart, MessageSquareText } from 'lucide-react';
import { PostCategoryBadge, type MainPostItem } from '@/entities/post';
import { cn } from '@/shared/lib/classnames';
import { formatPostListDate } from '@/shared/lib/date/formatCreatedAt';

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
    <PostCategoryBadge category={postItem.category} />
    <h2 className="mt-4 text-[19px] font-bold tracking-[-0.03em] text-slate-900">
      {postItem.title}
    </h2>
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
      <span className="inline-flex items-center gap-2">
        <span className="font-medium text-slate-700">{postItem.authorNickname}</span>
        <span className="text-slate-400">{formatPostListDate(postItem.createdAt)}</span>
      </span>
      <div className="flex items-center gap-4">
        <span className="inline-flex items-center gap-1.5">
          <Eye className="h-4 w-4 text-slate-400" />
          {postItem.viewCount}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Heart className="h-4 w-4 text-rose-400" />
          {postItem.likeCount}
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
