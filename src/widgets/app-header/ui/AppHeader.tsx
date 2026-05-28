import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router';
import { LogIn, LogOut, UserCircle2, UsersRound } from 'lucide-react';
import { logout, myUserQueryOptions } from '@/entities/user';
import {
  authSessionSelectors,
  clearAuthSession,
  useAuthSessionStore,
} from '@/shared/lib/auth/session';

interface AppHeaderProps {
  onLoginClick?: () => void;
}

const AppHeader = ({ onLoginClick }: AppHeaderProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthSessionStore(authSessionSelectors.isAuthenticated);

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSettled: async () => {
      clearAuthSession();
      await queryClient.invalidateQueries({ queryKey: myUserQueryOptions().queryKey });
      navigate('/');
    },
  });

  return (
    <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[78px] w-full max-w-5xl items-center justify-between px-5 md:px-8">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-2xl outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-indigo-200"
        >
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
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <UserCircle2 className="h-4 w-4" />
              프로필
            </Link>
            <button
              type="button"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="inline-flex items-center gap-2 rounded-2xl border border-indigo-200 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-500 transition hover:bg-indigo-50 disabled:opacity-70"
            >
              <LogOut className="h-4 w-4" />
              {logoutMutation.isPending ? '로그아웃 중...' : '로그아웃'}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (onLoginClick) {
                onLoginClick();
                return;
              }

              navigate('/login');
            }}
            className="inline-flex items-center gap-2 rounded-2xl border border-indigo-200 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-500 transition hover:bg-indigo-50"
          >
            <LogIn className="h-4 w-4" />
            로그인
          </button>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
