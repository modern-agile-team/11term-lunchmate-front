import { SendHorizonal } from 'lucide-react';
import type { CommentComposerState } from '../model/types';
import CommentActionMessage from './CommentActionMessage';

interface CommentComposerProps {
  composer: CommentComposerState;
}

const CommentComposer = ({ composer }: CommentComposerProps) => (
  <>
    <div className="rounded-[24px] bg-slate-50 p-4">
      <textarea
        rows={4}
        value={composer.inputValue}
        onChange={(event) => composer.changeInputValue(event.target.value)}
        placeholder="댓글을 입력해주세요"
        className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
      />
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={() => void composer.submit()}
          disabled={composer.isPending}
          className="inline-flex items-center gap-2 rounded-2xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-indigo-300"
        >
          <SendHorizonal className="h-4 w-4" />
          {composer.isPending ? '등록 중...' : '댓글 등록'}
        </button>
      </div>
    </div>

    {composer.message ? (
      <CommentActionMessage message={composer.message} tone={composer.tone} />
    ) : null}
  </>
);

export default CommentComposer;
