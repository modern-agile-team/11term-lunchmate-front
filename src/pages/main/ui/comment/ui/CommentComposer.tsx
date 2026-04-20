import { SendHorizonal } from 'lucide-react';

type MessageTone = 'success' | 'error';

interface CommentComposerProps {
  composer: {
    commentInputValue: string;
    setCommentInputValue: (value: string) => void;
    handleCommentSubmit: () => Promise<void>;
    isCommentSubmitPending: boolean;
    commentActionMessage: string;
    commentActionTone: MessageTone;
  };
}

const messageClassName = (tone: MessageTone) =>
  tone === 'error'
    ? 'rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600'
    : 'rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700';

const CommentComposer = ({ composer }: CommentComposerProps) => (
  <>
    <div className="rounded-[24px] bg-slate-50 p-4">
      <textarea
        rows={4}
        value={composer.commentInputValue}
        onChange={(event) => composer.setCommentInputValue(event.target.value)}
        placeholder="댓글을 입력해주세요"
        className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
      />
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={() => void composer.handleCommentSubmit()}
          disabled={composer.isCommentSubmitPending}
          className="inline-flex items-center gap-2 rounded-2xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-indigo-300"
        >
          <SendHorizonal className="h-4 w-4" />
          {composer.isCommentSubmitPending ? '등록 중...' : '댓글 등록'}
        </button>
      </div>
    </div>

    {composer.commentActionMessage ? (
      <p className={messageClassName(composer.commentActionTone)}>{composer.commentActionMessage}</p>
    ) : null}
  </>
);

export default CommentComposer;
