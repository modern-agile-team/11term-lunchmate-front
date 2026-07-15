import { Flame, PencilLine, ThumbsDown, ThumbsUp, Trash2 } from 'lucide-react';
import { cn } from '@/shared/lib/classnames';
import { lunchMealTypeLabelMap, type MainLunchMenu } from '../model/types';

const KRW_NUMBER_FORMAT = new Intl.NumberFormat('ko-KR');

interface LunchMenuCardProps {
  menu: MainLunchMenu;
  isSelected: boolean;
  onSelect: (menuId: number) => void;
  isAdmin?: boolean;
  onEdit?: (menu: MainLunchMenu) => void;
  onDelete?: (menu: MainLunchMenu) => void;
}

const LunchMenuCard = ({
  menu,
  isSelected,
  onSelect,
  isAdmin,
  onEdit,
  onDelete,
}: LunchMenuCardProps) => (
  <article
    onClick={() => onSelect(menu.id)}
    className={cn(
      'cursor-pointer rounded-[28px] border bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] transition md:p-6',
      isSelected ? 'border-emerald-200 ring-4 ring-emerald-100/70' : 'border-emerald-100 hover:border-emerald-200',
    )}
  >
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <div className="inline-flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
            {menu.schoolInfo} · {lunchMealTypeLabelMap[menu.mealType]}
          </span>
          {isAdmin ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onEdit?.(menu);
              }}
              aria-label="메뉴 수정"
              title="메뉴 수정"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
            >
              <PencilLine className="h-3.5 w-3.5" />
            </button>
          ) : null}
          {isAdmin ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onDelete?.(menu);
              }}
              aria-label="메뉴 삭제"
              title="메뉴 삭제"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-rose-100 hover:text-rose-600"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
        <h2 className="mt-3 text-[20px] font-bold tracking-[-0.03em] text-slate-900">
          {menu.menuName}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          {menu.components.join(', ')}
        </p>
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
        좋아요 {menu.likeCount}
      </div>
      <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-slate-700">
        <ThumbsDown
          className={`h-4 w-4 ${menu.dislikedByMe ? 'text-rose-700' : 'text-rose-500'}`}
        />
        싫어요 {menu.dislikeCount}
      </div>
    </div>
  </article>
);

export default LunchMenuCard;
