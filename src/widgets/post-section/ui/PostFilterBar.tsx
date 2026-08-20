import { useQuery } from '@tanstack/react-query';
import { postCategoryListQueryOptions } from '@/entities/post';
import { cn } from '@/shared/lib/classnames';

interface PostFilterBarProps {
  selectedCategoryId: number | null;
  setSelectedCategoryId: (categoryId: number | null) => void;
}

const PostFilterBar = ({ selectedCategoryId, setSelectedCategoryId }: PostFilterBarProps) => {
  const categoriesQuery = useQuery(postCategoryListQueryOptions());
  const categories = categoriesQuery.data ?? [];

  return (
    <section className="rounded-[28px] border border-slate-200/80 bg-white px-5 py-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] md:px-6">
      <p className="text-sm font-semibold text-slate-700">카테고리</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedCategoryId(null)}
          className={cn(
            'rounded-2xl px-4 py-2.5 text-sm font-semibold transition',
            selectedCategoryId === null
              ? 'bg-slate-900 text-white'
              : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
          )}
        >
          전체
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setSelectedCategoryId(category.id)}
            className={cn(
              'rounded-2xl px-4 py-2.5 text-sm font-semibold transition',
              selectedCategoryId === category.id
                ? 'bg-slate-900 text-white'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
            )}
          >
            {category.name}
          </button>
        ))}
      </div>
    </section>
  );
};

export default PostFilterBar;
