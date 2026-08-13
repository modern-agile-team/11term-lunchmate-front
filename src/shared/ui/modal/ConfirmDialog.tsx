import { AlertTriangle, CheckCircle2, X } from 'lucide-react';
import type { MouseEvent } from 'react';
import { useDialog } from '@/shared/lib/useDialog';

interface ConfirmDialogProps {
  isOpen: boolean;
  tone?: 'danger' | 'default';
  eyebrow: string;
  title: string;
  description: string;
  confirmLabel: string;
  pendingLabel?: string;
  isPending: boolean;
  errorMessage?: string;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDialog = ({
  isOpen,
  tone = 'danger',
  eyebrow,
  title,
  description,
  confirmLabel,
  pendingLabel,
  isPending,
  errorMessage,
  onClose,
  onConfirm,
}: ConfirmDialogProps) => {
  const dialogRef = useDialog({
    isOpen,
    onClose: () => {
      if (!isPending) {
        onClose();
      }
    },
  });

  const handleDialogClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current && !isPending) {
      onClose();
    }
  };

  const iconWrapperClassName =
    tone === 'danger' ? 'bg-rose-50 text-rose-500' : 'bg-sky-50 text-sky-600';
  const eyebrowClassName = tone === 'danger' ? 'text-rose-500' : 'text-sky-600';
  const confirmButtonClassName =
    tone === 'danger'
      ? 'bg-rose-500 shadow-[0_10px_24px_rgba(244,63,94,0.25)] hover:bg-rose-600 disabled:bg-rose-300'
      : 'bg-sky-600 shadow-[0_10px_24px_rgba(2,132,199,0.25)] hover:bg-sky-700 disabled:bg-sky-300';

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleDialogClick}
      className="m-auto backdrop:bg-slate-950/50 w-full max-w-lg rounded-[32px] bg-white p-0 text-left shadow-[0_24px_80px_rgba(15,23,42,0.22)] backdrop:backdrop-blur-[2px]"
    >
      <div className="p-6 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className={`mt-0.5 inline-flex h-11 w-11 items-center justify-center rounded-2xl ${iconWrapperClassName}`}
            >
              {tone === 'danger' ? (
                <AlertTriangle className="h-5 w-5" />
              ) : (
                <CheckCircle2 className="h-5 w-5" />
              )}
            </div>
            <div>
              <p className={`text-sm font-semibold ${eyebrowClassName}`}>{eyebrow}</p>
              <h2 className="mt-1 text-[24px] font-bold tracking-[-0.03em] text-slate-900">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
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
            className={`rounded-2xl px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed ${confirmButtonClassName}`}
          >
            {isPending ? (pendingLabel ?? '처리 중...') : confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ConfirmDialog;
