import { Medal, ThumbsDown, ThumbsUp, TrendingUp } from 'lucide-react';
import type { MainRankingItem } from '../model/types';

const rankStyleMap = {
  1: 'from-amber-400 to-orange-400',
  2: 'from-slate-300 to-slate-400',
  3: 'from-orange-300 to-amber-600',
} as const;

interface RankingSectionProps {
  rankings: MainRankingItem[];
}

const RankingSection = ({ rankings }: RankingSectionProps) => {
  return (
    <section className="grid gap-4 md:gap-5">
      {rankings.map((mockRanking) => (
        <article
          key={mockRanking.id}
          className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] md:p-6"
        >
          <div className="flex items-center gap-4">
            <div
              className={[
                'flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-[0_10px_24px_rgba(15,23,42,0.12)]',
                rankStyleMap[mockRanking.rank as keyof typeof rankStyleMap] ??
                  'from-indigo-400 to-indigo-500',
              ].join(' ')}
            >
              <Medal className="h-6 w-6" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-indigo-500">TOP {mockRanking.rank}</div>
              <h2 className="mt-1 truncate text-[20px] font-bold tracking-[-0.03em] text-slate-900">
                {mockRanking.title}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {mockRanking.cafeteriaName} · {mockRanking.mealTime}
              </p>
            </div>

            <div className="rounded-2xl bg-indigo-50 px-4 py-3 text-right">
              <div className="text-xs font-semibold text-indigo-600">반응 점수</div>
              <div className="mt-1 text-xl font-bold text-slate-900">{mockRanking.score}</div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600">
              <TrendingUp className="h-4 w-4 text-indigo-500" />
              {mockRanking.changeText}
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700">
              <ThumbsUp className="h-4 w-4" />
              {mockRanking.likedCount}
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
              <ThumbsDown className="h-4 w-4" />
              {mockRanking.dislikedCount}
            </div>
          </div>
        </article>
      ))}
    </section>
  );
};

export default RankingSection;
