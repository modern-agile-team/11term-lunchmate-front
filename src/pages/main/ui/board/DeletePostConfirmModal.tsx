import { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeletePostConfirmModalProps {
  isOpen: boolean;
  isPending: boolean;
  errorMessage: string;
  onClose: () => void;
  onConfirm: () => void;
}

const DeletePostConfirmModal = ({
  isOpen,
  isPending,
  errorMessage,
  onClose,
  onConfirm,
}: DeletePostConfirmModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialogElement = dialogRef.current;

    if (!dialogElement) {
      return;
    }

    if (isOpen && !dialogElement.open) {
      dialogElement.showModal();
      return;
    }

    if (!isOpen && dialogElement.open) {
      dialogElement.close();
    }
  }, [isOpen]);

  const handleDialogClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current && !isPending) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleDialogClick}
      className="backdrop:bg-slate-950/50 w-full max-w-lg rounded-[32px] bg-white p-0 text-left shadow-[0_24px_80px_rgba(15,23,42,0.22)] backdrop:backdrop-blur-[2px]"
    >
      <div className="p-6 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-rose-500">게시글 삭제</p>
              <h2 className="mt-1 text-[24px] font-bold tracking-[-0.03em] text-slate-900">
                이 게시글을 삭제할까요?
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                삭제 후 되돌릴 수 없어요.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMessage ? (
          <p className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {errorMessage}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col-reverse gap-3 md:flex-row md:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="rounded-2xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(244,63,94,0.25)] transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-rose-300"
          >
            {isPending ? '삭제 중...' : '삭제'}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default DeletePostConfirmModal;
