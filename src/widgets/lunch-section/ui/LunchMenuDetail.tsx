import { Flame, ThumbsDown, ThumbsUp } from 'lucide-react';
import { lunchMealTypeLabelMap, type MainLunchMenu } from '../model/types';

const KRW_NUMBER_FORMAT = new Intl.NumberFormat('ko-KR');

interface LunchMenuDetailProps {
  menu: MainLunchMenu;
  onLike: (menuId: number) => void;
  onDislike: (menuId: number) => void;
  isReactionPending?: boolean;
}

const LunchMenuDetail = ({ menu, onLike, onDislike, isReactionPending }: LunchMenuDetailProps) => (
  <div className="mt-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
        {menu.schoolInfo} · {lunchMealTypeLabelMap[menu.mealType]}
      </div>

      <div className="rounded-[24px] bg-emerald-50 px-5 py-4">
        <div className="text-xs font-semibold text-emerald-600">메뉴 정보</div>
        <div className="mt-2 text-xl font-bold text-slate-900">
          {menu.price !== null ? `${KRW_NUMBER_FORMAT.format(menu.price)}원` : '가격 미정'}
        </div>
        <div className="mt-2 flex items-center gap-1 text-sm text-slate-500">
          <Flame className="h-4 w-4 text-orange-400" />
          {menu.calorie !== null ? `${menu.calorie}kcal` : '칼로리 미정'}
        </div>
      </div>
    </div>

    <div className="mt-6 grid gap-4">
      <section className="rounded-[24px] bg-slate-50 px-5 py-5">
        <h4 className="text-sm font-semibold text-slate-700">구성</h4>
        <div className="mt-3 flex flex-wrap gap-2">
          {menu.components.map((component) => (
            <span
              key={component}
              className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600"
            >
              {component}
            </span>
          ))}
        </div>
      </section>
    </div>

    <div className="mt-6 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => onLike(menu.id)}
        disabled={isReactionPending}
        className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(99,102,241,0.22)] transition disabled:cursor-not-allowed disabled:opacity-60 ${
          menu.myReaction === 'LIKE'
            ? 'bg-indigo-700 hover:bg-indigo-800'
            : 'bg-indigo-500 hover:bg-indigo-600'
        }`}
      >
        <ThumbsUp className="h-4 w-4" />
        좋아요 {menu.likeCount}
      </button>
      <button
        type="button"
        onClick={() => onDislike(menu.id)}
        disabled={isReactionPending}
        className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
          menu.myReaction === 'DISLIKE'
            ? 'bg-rose-600 text-white hover:bg-rose-700'
            : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
        }`}
      >
        <ThumbsDown className="h-4 w-4" />
        싫어요 {menu.dislikeCount}
      </button>
    </div>
  </div>
);

export default LunchMenuDetail;
