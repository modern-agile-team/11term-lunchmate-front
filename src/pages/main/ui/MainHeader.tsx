import { LogIn, UsersRound } from 'lucide-react';

interface MainHeaderProps {
  onLoginClick: () => void;
}

const MainHeader = ({ onLoginClick }: MainHeaderProps) => {
  return (
    <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[78px] w-full max-w-5xl items-center justify-between px-5 md:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-[0_10px_24px_rgba(99,102,241,0.25)]">
            <UsersRound className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[22px] font-extrabold tracking-[-0.03em] text-slate-900">
              점메추
            </span>
            <span className="text-xs font-medium tracking-[0.02em] text-slate-400">
              점심메이트 추천
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onLoginClick}
          className="inline-flex items-center gap-2 rounded-2xl border border-indigo-200 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-500 transition hover:bg-indigo-50"
        >
          <LogIn className="h-4 w-4" />
          로그인
        </button>
      </div>
    </header>
  );
};

export default MainHeader;
