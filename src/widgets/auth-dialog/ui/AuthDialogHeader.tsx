import { ArrowLeft, UsersRound } from 'lucide-react';

interface AuthDialogHeaderProps {
  onClose: () => void;
}

const AuthDialogHeader = ({ onClose }: AuthDialogHeaderProps) => (
  <header className="border-b border-slate-200/80 bg-white">
    <div className="mx-auto flex h-[78px] w-full max-w-6xl items-center gap-4 px-5 md:px-8">
      <button
        type="button"
        onClick={onClose}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
        aria-label="로그인 창 닫기"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-[0_10px_24px_rgba(99,102,241,0.25)]">
          <UsersRound className="h-5 w-5" />
        </div>
        <div className="text-lg font-extrabold tracking-[-0.03em] text-slate-900">
          점메추<span className="text-indigo-500">추</span>
        </div>
      </div>
    </div>
  </header>
);

export default AuthDialogHeader;
