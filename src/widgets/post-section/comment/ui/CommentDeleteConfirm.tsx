import { X } from 'lucide-react';

interface CommentDeleteConfirmProps {
  onCancel: () => void;
  onConfirm: () => void;
}

const CommentDeleteConfirm = ({ onCancel, onConfirm }: CommentDeleteConfirmProps) => (
  <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4">
    <div className="flex items-start justify-between gap-3">
      <p className="text-sm text-rose-600">이 댓글을 삭제할까요? 되돌릴 수 없어요.</p>
      <button
        type="button"
        onClick={onCancel}
        className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white text-slate-500 transition hover:bg-slate-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
    <div className="mt-3 flex justify-end gap-2">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-2xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
      >
        취소
      </button>
      <button
        type="button"
        onClick={onConfirm}
        className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
      >
        삭제
      </button>
    </div>
  </div>
);

export default CommentDeleteConfirm;
