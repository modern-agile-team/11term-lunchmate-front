import type { PostCategory } from '../model/types';

const POST_CATEGORY_STYLES = [
  'bg-slate-100 text-slate-600',
  'bg-amber-50 text-amber-700',
  'bg-sky-50 text-sky-700',
  'bg-violet-50 text-violet-700',
  'bg-emerald-50 text-emerald-700',
  'bg-rose-50 text-rose-700',
];

interface PostCategoryBadgeProps {
  category: PostCategory;
}

const PostCategoryBadge = ({ category }: PostCategoryBadgeProps) => (
  <span
    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
      POST_CATEGORY_STYLES[category.id % POST_CATEGORY_STYLES.length]
    }`}
  >
    {category.name}
  </span>
);

export default PostCategoryBadge;
