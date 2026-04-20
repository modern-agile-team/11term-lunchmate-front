import { Flame, MapPin, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/shared/lib/classnames';

import { mockLunchMenus } from '../model/mockLunchMenus';

const KRW_NUMBER_FORMAT = new Intl.NumberFormat('ko-KR');

const LunchSection = () => {
  const initialSelectedLunchMenuId = mockLunchMenus[0]?.id ?? null;
  const [selectedLunchMenuId, setSelectedLunchMenuId] = useState<number | null>(
    initialSelectedLunchMenuId,
  );
  const selectedLunchMenu = mockLunchMenus.find(
    (mockLunchMenu) => mockLunchMenu.id === selectedLunchMenuId,
  );

  return (
    <section className="space-y-4 md:space-y-5">
      {mockLunchMenus.map((mockLunchMenu) => (
        <article
          key={mockLunchMenu.id}
          onClick={() => setSelectedLunchMenuId(mockLunchMenu.id)}
          className={cn(
            'cursor-pointer rounded-[28px] border bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] transition md:p-6',
            selectedLunchMenuId === mockLunchMenu.id
              ? 'border-emerald-200 ring-4 ring-emerald-100/70'
              : 'border-emerald-100 hover:border-emerald-200',
          )}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                {mockLunchMenu.cafeteriaName} · {mockLunchMenu.mealTime}
              </div>
              <h2 className="mt-3 text-[20px] font-bold tracking-[-0.03em] text-slate-900">
                {mockLunchMenu.title}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                {mockLunchMenu.description}
              </p>
            </div>

            <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-right">
              <div className="text-xs font-semibold text-emerald-600">한 끼 정보</div>
              <div className="mt-2 text-lg font-bold text-slate-900">
                {KRW_NUMBER_FORMAT.format(mockLunchMenu.price)}원
              </div>
              <div className="mt-1 inline-flex items-center gap-1 text-sm text-slate-500">
                <Flame className="h-4 w-4 text-orange-400" />
                {mockLunchMenu.calorie}kcal
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3 text-sm font-medium">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-slate-700">
              <ThumbsUp className="h-4 w-4 text-indigo-500" />
              좋아요 {mockLunchMenu.likedCount}
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-slate-700">
              <ThumbsDown className="h-4 w-4 text-rose-500" />
              싫어요 {mockLunchMenu.dislikedCount}
            </div>
          </div>
        </article>
      ))}

      {selectedLunchMenu ? (
        <article className="rounded-[32px] border border-emerald-100 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] md:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                {selectedLunchMenu.cafeteriaName} · {selectedLunchMenu.mealTime}
              </div>
              <h3 className="mt-4 text-[26px] font-bold tracking-[-0.03em] text-slate-900">
                {selectedLunchMenu.title}
              </h3>
              <p className="mt-3 max-w-2xl whitespace-pre-line text-sm leading-7 text-slate-600">
                {selectedLunchMenu.detailDescription}
              </p>
            </div>

            <div className="rounded-[24px] bg-emerald-50 px-5 py-4">
              <div className="text-xs font-semibold text-emerald-600">메뉴 정보</div>
              <div className="mt-2 text-xl font-bold text-slate-900">
                {KRW_NUMBER_FORMAT.format(selectedLunchMenu.price)}원
              </div>
              <div className="mt-2 flex items-center gap-1 text-sm text-slate-500">
                <Flame className="h-4 w-4 text-orange-400" />
                {selectedLunchMenu.calorie}kcal
              </div>
              <div className="mt-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                맵기 {selectedLunchMenu.spicyLevel}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-[24px] bg-slate-50 px-5 py-5">
              <h4 className="text-sm font-semibold text-slate-700">구성</h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedLunchMenu.sideMenus.map((sideMenu) => (
                  <span
                    key={sideMenu}
                    className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600"
                  >
                    {sideMenu}
                  </span>
                ))}
              </div>
            </section>

            <section className="rounded-[24px] bg-slate-50 px-5 py-5">
              <h4 className="text-sm font-semibold text-slate-700">식당 정보</h4>
              <div className="mt-3 inline-flex items-center gap-2 text-sm text-slate-600">
                <MapPin className="h-4 w-4 text-emerald-500" />
                {selectedLunchMenu.location}
              </div>
            </section>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(99,102,241,0.22)] transition hover:bg-indigo-600"
            >
              <ThumbsUp className="h-4 w-4" />
              좋아요 {selectedLunchMenu.likedCount}
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl bg-rose-100 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-200"
            >
              <ThumbsDown className="h-4 w-4" />
              싫어요 {selectedLunchMenu.dislikedCount}
            </button>
          </div>
        </article>
      ) : null}
    </section>
  );
};

export default LunchSection;
