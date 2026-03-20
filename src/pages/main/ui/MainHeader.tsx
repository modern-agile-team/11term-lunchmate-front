import { LogIn, UsersRound } from 'lucide-react';

const MainHeader = () => {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-20 w-full max-w-5xl items-center justify-between px-5 md:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500 text-white">
            <UsersRound className="h-5 w-5" />
          </div>
          <div className="text-lg font-extrabold tracking-tight text-slate-900">
            점심메이트<span className="text-indigo-500">추가</span>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-2xl border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-500 transition hover:bg-indigo-50"
        >
          <LogIn className="h-4 w-4" />
          로그인
        </button>
      </div>
    </header>
  );
};

export default MainHeader;
