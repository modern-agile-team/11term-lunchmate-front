import { Heart, MessageSquareText } from 'lucide-react';

import { mockBoardPosts } from '../mocks/mockBoardPosts';

const categoryStyleMap = {
  FREE: 'bg-slate-100 text-slate-600',
  REVIEW: 'bg-amber-50 text-amber-700',
  INFO: 'bg-sky-50 text-sky-700',
  TALK: 'bg-violet-50 text-violet-700',
} as const;

const MainBoardSection = () => {
  return (
    <section className="space-y-4 md:space-y-5">
      {mockBoardPosts.map((mockBoardPost) => (
        <article
          key={mockBoardPost.id}
          className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] md:p-6"
        >
          <div className="flex items-center justify-between gap-3">
            <span
              className={[
                'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
                categoryStyleMap[mockBoardPost.category],
              ].join(' ')}
            >
              {mockBoardPost.category}
            </span>
            <span className="text-sm text-slate-400">{mockBoardPost.createdAt}</span>
          </div>

          <h2 className="mt-4 text-[19px] font-bold tracking-[-0.03em] text-slate-900">
            {mockBoardPost.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">{mockBoardPost.summary}</p>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
            <span className="font-medium text-slate-700">{mockBoardPost.author}</span>

            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <Heart className="h-4 w-4 text-rose-400" />
                {mockBoardPost.likedCount}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MessageSquareText className="h-4 w-4 text-indigo-500" />
                {mockBoardPost.commentCount}
              </span>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
};

export default MainBoardSection;
