import { Flame, ThumbsDown, ThumbsUp } from 'lucide-react';
import { cn } from '@/shared/lib/classnames';
import type { MainLunchMenu } from '../model/types';

const KRW_NUMBER_FORMAT = new Intl.NumberFormat('ko-KR');

interface LunchMenuCardProps {
  menu: MainLunchMenu;
  isSelected: boolean;
  onSelect: (menuId: number) => void;
}

const LunchMenuCard = ({ menu, isSelected, onSelect }: LunchMenuCardProps) => (
  <article
    onClick={() => onSelect(menu.id)}
    className={cn(
      'cursor-pointer rounded-[28px] border bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] transition md:p-6',
      isSelected ? 'border-emerald-200 ring-4 ring-emerald-100/70' : 'border-emerald-100 hover:border-emerald-200',
    )}
  >
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <div className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
          {menu.cafeteriaName} · {menu.mealTime}
        </div>
        <h2 className="mt-3 text-[20px] font-bold tracking-[-0.03em] text-slate-900">
          {menu.title}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{menu.description}</p>
      </div>

      <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-right">
        <div className="text-xs font-semibold text-emerald-600">한 끼 정보</div>
        <div className="mt-2 text-lg font-bold text-slate-900">
          {KRW_NUMBER_FORMAT.format(menu.price)}원
        </div>
        <div className="mt-1 inline-flex items-center gap-1 text-sm text-slate-500">
          <Flame className="h-4 w-4 text-orange-400" />
          {menu.calorie}kcal
        </div>
      </div>
    </div>

    <div className="mt-5 flex flex-wrap gap-3 text-sm font-medium">
      <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-slate-700">
        <ThumbsUp className={`h-4 w-4 ${menu.likedByMe ? 'text-indigo-700' : 'text-indigo-500'}`} />
        좋아요 {menu.likedCount}
      </div>
      <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-slate-700">
        <ThumbsDown
          className={`h-4 w-4 ${menu.dislikedByMe ? 'text-rose-700' : 'text-rose-500'}`}
        />
        싫어요 {menu.dislikedCount}
      </div>
    </div>
  </article>
);

export default LunchMenuCard;
