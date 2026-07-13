import { Medal, ThumbsDown, ThumbsUp } from 'lucide-react';
import type { MainRankingItem } from '../model/types';

const rankStyleMap = {
  1: 'from-amber-400 to-orange-400',
  2: 'from-slate-300 to-slate-400',
  3: 'from-orange-400 to-amber-700',
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
          className="flex items-center rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] md:p-6"
        >
          <div className="flex flex-1 items-center gap-4">
            <div
              className={[
                'flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-[0_10px_24px_rgba(15,23,42,0.12)]',
                rankStyleMap[mockRanking.rank as keyof typeof rankStyleMap] ??
                  'from-slate-400 to-slate-500',
              ].join(' ')}
            >
              {mockRanking.rank <= 3 ? (
                <Medal className="h-6 w-6" />
              ) : (
                <span className="text-lg font-bold">{mockRanking.rank}</span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-indigo-500">TOP {mockRanking.rank}</div>
              <div className="mt-1 flex items-center">
                <h2 className="min-w-0 shrink truncate text-[20px] font-bold tracking-[-0.03em] text-slate-900">
                  {mockRanking.title}
                </h2>
                <p className="ml-2 shrink-0 text-sm text-slate-500">
                  {mockRanking.cafeteriaName} · {mockRanking.mealTime}
                </p>
              </div>
            </div>
          </div>

          <div className="flex max-w-50 min-w-40 shrink-0 items-center justify-between">
            <span className="flex items-center gap-1.5 text-lg font-semibold tabular-nums text-slate-700">
              <ThumbsUp className="h-5 w-5 text-indigo-500" />
              {mockRanking.likedCount}개
            </span>
            <span className="flex items-center gap-1.5 text-lg font-semibold tabular-nums text-slate-700">
              <ThumbsDown className="h-5 w-5 text-rose-400" />
              {mockRanking.dislikedCount}개
            </span>
          </div>
        </article>
      ))}
    </section>
  );
};

export default RankingSection;
