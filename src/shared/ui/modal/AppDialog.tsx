import { X } from 'lucide-react';
import type { ReactNode, MouseEvent } from 'react';
import { useDialog } from '@/shared/lib/useDialog';

interface AppDialogProps {
  isOpen: boolean;
  onClose: () => void;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  maxWidthClassName?: string;
}

const AppDialog = ({
  isOpen,
  onClose,
  eyebrow,
  title,
  subtitle,
  children,
  maxWidthClassName = 'max-w-2xl',
}: AppDialogProps) => {
  const dialogRef = useDialog({
    isOpen,
    onClose,
  });

  const handleDialogClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleDialogClick}
      className={`backdrop:bg-slate-950/50 w-full ${maxWidthClassName} rounded-[32px] bg-white p-0 text-left shadow-[0_24px_80px_rgba(15,23,42,0.22)] backdrop:backdrop-blur-[2px]`}
    >
      <div className="p-6 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            {eyebrow ? <p className="text-sm font-semibold text-indigo-500">{eyebrow}</p> : null}
            <h2 className="mt-1 text-[24px] font-bold tracking-[-0.03em] text-slate-900">
              {title}
            </h2>
            {subtitle ? <p className="mt-2 text-sm text-slate-500">{subtitle}</p> : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {children}
      </div>
    </dialog>
  );
};

export default AppDialog;
