import { Heart, MessageSquareText, Pencil, SendHorizonal, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { mockBoardComments } from '../mocks/mockBoardComments';
import { mockBoardPosts } from '../mocks/mockBoardPosts';

const categoryStyleMap = {
  FREE: 'bg-slate-100 text-slate-600',
  REVIEW: 'bg-amber-50 text-amber-700',
  INFO: 'bg-sky-50 text-sky-700',
  TALK: 'bg-violet-50 text-violet-700',
} as const;

const formatRelativeCreatedAt = (createdAt: string) => {
  const currentTime = Date.now();
  const createdTime = new Date(createdAt).getTime();
  const diffMinutes = Math.max(1, Math.floor((currentTime - createdTime) / (1000 * 60)));

  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }

  const diffDays = Math.floor(diffHours / 24);

  return `${diffDays}일 전`;
};

const MainBoardSection = () => {
  const [selectedBoardPostId, setSelectedBoardPostId] = useState(mockBoardPosts[0]?.id ?? 0);
  const selectedBoardPost = mockBoardPosts.find(
    (mockBoardPost) => mockBoardPost.id === selectedBoardPostId,
  );
  const selectedBoardComments = mockBoardComments.filter(
    (mockBoardComment) => mockBoardComment.postId === selectedBoardPostId,
  );

  return (
    <section className="space-y-4 md:space-y-5">
      {mockBoardPosts.map((mockBoardPost) => (
        <article
          key={mockBoardPost.id}
          className={[
            'cursor-pointer rounded-[28px] border bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] transition',
            selectedBoardPostId === mockBoardPost.id
              ? 'border-indigo-200 ring-4 ring-indigo-100/60'
              : 'border-slate-200/80 hover:border-slate-300',
          ].join(' ')}
          onClick={() => setSelectedBoardPostId(mockBoardPost.id)}
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
            <span className="text-sm text-slate-400">
              {formatRelativeCreatedAt(mockBoardPost.createdAt)}
            </span>
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

      {selectedBoardPost ? (
        <article className="rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span
                className={[
                  'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
                  categoryStyleMap[selectedBoardPost.category],
                ].join(' ')}
              >
                {selectedBoardPost.category}
              </span>
              <span className="text-sm text-slate-400">
                {formatRelativeCreatedAt(selectedBoardPost.createdAt)}
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 text-sm text-slate-500">
              <Heart className="h-4 w-4 text-rose-400" />
              {selectedBoardPost.likedCount}
            </div>
          </div>

          <h3 className="mt-5 text-[24px] font-bold tracking-[-0.03em] text-slate-900">
            {selectedBoardPost.title}
          </h3>
          <p className="mt-2 text-sm font-medium text-slate-500">{selectedBoardPost.author}</p>

          <div className="mt-6 whitespace-pre-line rounded-[24px] bg-slate-50 px-5 py-5 text-sm leading-7 text-slate-600">
            {selectedBoardPost.content}
          </div>

          <section className="mt-8">
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-lg font-bold tracking-[-0.03em] text-slate-900">
                댓글 {selectedBoardComments.length}
              </h4>
              <span className="text-sm text-slate-400">mock UI</span>
            </div>

            <div className="mt-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">댓글 작성</span>
                <textarea
                  placeholder="댓글을 입력해보세요"
                  className="mt-3 min-h-[110px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                />
              </label>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600"
                >
                  <SendHorizonal className="h-4 w-4" />
                  댓글 등록
                </button>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {selectedBoardComments.map((selectedBoardComment) => (
                <article
                  key={selectedBoardComment.id}
                  className="rounded-[24px] border border-slate-200/80 bg-white px-5 py-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        {selectedBoardComment.author}
                      </div>
                      <div className="mt-1 text-xs text-slate-400">
                        {formatRelativeCreatedAt(selectedBoardComment.createdAt)}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-medium text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <Heart className="h-3.5 w-3.5 text-rose-400" />
                        {selectedBoardComment.likedCount}
                      </span>

                      {selectedBoardComment.isMine ? (
                        <>
                          <button type="button" className="inline-flex items-center gap-1 hover:text-slate-600">
                            <Pencil className="h-3.5 w-3.5" />
                            수정
                          </button>
                          <button type="button" className="inline-flex items-center gap-1 hover:text-slate-600">
                            <Trash2 className="h-3.5 w-3.5" />
                            삭제
                          </button>
                        </>
                      ) : null}
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {selectedBoardComment.content}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </article>
      ) : null}
    </section>
  );
};

export default MainBoardSection;
