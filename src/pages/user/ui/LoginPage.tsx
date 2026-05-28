import { UsersRound } from 'lucide-react';
import { Link } from 'react-router';
import LoginForm from '@/features/auth/loginForm';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_34%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col justify-center gap-8 lg:flex-row lg:items-center">
        <section className="max-w-xl text-slate-900">
          <div className="inline-flex items-center gap-3 rounded-full border border-indigo-200/70 bg-white/80 px-4 py-2 text-sm font-medium text-indigo-600 shadow-sm backdrop-blur">
            <UsersRound className="h-4 w-4" />
            점심메이트 인증
          </div>
          <h1 className="mt-6 text-4xl font-black tracking-[-0.05em] text-slate-900 sm:text-5xl">
            로그인하고
            <br />
            점심메이트를 찾아보세요.
          </h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
            로그인에 성공하면 자동으로 원래 보려던 화면으로 이동합니다.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-700"
          >
            서비스 메인으로 이동
          </Link>
        </section>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
