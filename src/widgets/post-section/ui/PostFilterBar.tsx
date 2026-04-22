import { cn } from '@/shared/lib/classnames';
import { postCategoryFilterOptions } from '../model/constants';
import type { MainPostCategoryFilter } from '../model/constants';

interface PostFilterBarProps {
  selectedCategory: MainPostCategoryFilter;
  setSelectedCategory: (category: MainPostCategoryFilter) => void;
}

const PostFilterBar = ({ selectedCategory, setSelectedCategory }: PostFilterBarProps) => (
  <section className="rounded-[28px] border border-slate-200/80 bg-white px-5 py-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] md:px-6">
    <p className="text-sm font-semibold text-slate-700">카테고리</p>
    <div className="mt-2 flex flex-wrap gap-2">
      {postCategoryFilterOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setSelectedCategory(option.value)}
          className={cn(
            'rounded-2xl px-4 py-2.5 text-sm font-semibold transition',
            selectedCategory === option.value
              ? 'bg-slate-900 text-white'
              : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  </section>
);

export default PostFilterBar;
