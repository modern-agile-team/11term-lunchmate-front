import type { MainPostComment } from '@/entities/comment';

interface CommentItemEditorProps {
  comment: MainPostComment;
  editingCommentValue: string;
  onEditingChange: (value: string) => void;
  onEditCancel: () => void;
  onEditSubmit: (comment: MainPostComment) => void;
}

const CommentItemEditor = ({
  comment,
  editingCommentValue,
  onEditingChange,
  onEditCancel,
  onEditSubmit,
}: CommentItemEditorProps) => (
  <div className="mt-4 space-y-3">
    <textarea
      rows={4}
      value={editingCommentValue}
      onChange={(event) => onEditingChange(event.target.value)}
      className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
    />
    <div className="flex justify-end gap-2">
      <button
        type="button"
        onClick={onEditCancel}
        className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
      >
        취소
      </button>
      <button
        type="button"
        onClick={() => onEditSubmit(comment)}
        className="rounded-2xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600"
      >
        수정 저장
      </button>
    </div>
  </div>
);

export default CommentItemEditor;
