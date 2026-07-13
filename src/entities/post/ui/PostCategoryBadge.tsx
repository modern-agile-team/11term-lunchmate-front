import type { MainPostCategory } from '../model/mainPost';
import { postCategoryOptions } from '../model/postCategory';

const postCategoryStyleMap: Record<MainPostCategory, string> = {
  FREE: 'bg-slate-100 text-slate-600',
  REVIEW: 'bg-amber-50 text-amber-700',
  INFO: 'bg-sky-50 text-sky-700',
  TALK: 'bg-violet-50 text-violet-700',
};

interface PostCategoryBadgeProps {
  category: MainPostCategory;
}

const PostCategoryBadge = ({ category }: PostCategoryBadgeProps) => (
  <span
    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${postCategoryStyleMap[category]}`}
  >
    {postCategoryOptions.find((categoryOption) => categoryOption.value === category)?.label}
  </span>
);

export default PostCategoryBadge;
