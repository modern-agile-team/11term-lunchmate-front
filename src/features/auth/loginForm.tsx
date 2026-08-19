import { LogIn, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useLoginForm } from './sign-in';
import { getSocialLoginUrl } from '@/entities/user';

const LoginForm = () => {
  const navigate = useNavigate();
  const { emailField, passwordField, errors, isPending, errorMessage, onSubmit } = useLoginForm({
    onSuccess: () => {
      navigate('/profile');
    },
  });

  return (
    <section className="w-full max-w-md rounded-[32px] border border-white/70 bg-white/90 p-7 shadow-lg backdrop-blur sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
          <LogIn className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">로그인</h2>
          <p className="text-sm text-slate-500">서비스 이용을 위해 로그인해 주세요.</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div className="space-y-1">
          <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
            이메일
          </label>
          <input
            id="email"
            type="email"
            {...emailField}
            className={`h-12 w-full rounded-2xl border px-4 text-sm transition outline-none ${
              errors.email
                ? 'border-red-400 bg-red-50'
                : 'border-slate-200 bg-slate-50 focus:border-indigo-300 focus:bg-white'
            }`}
            placeholder="example@email.com"
          />
          {errors.email && <p className="text-xs text-red-500 pl-1">{errors.email.message}</p>}
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            {...passwordField}
            className={`h-12 w-full rounded-2xl border px-4 text-sm transition outline-none ${
              errors.password
                ? 'border-red-400 bg-red-50'
                : 'border-slate-200 bg-slate-50 focus:border-indigo-300 focus:bg-white'
            }`}
            placeholder="비밀번호를 입력하세요"
          />
          {errors.password && (
            <p className="text-xs text-red-500 pl-1">{errors.password.message}</p>
          )}
        </div>

        {errorMessage && (
          <p className="text-xs text-red-500 text-center font-medium">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-70"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
          {isPending ? '확인 중...' : '로그인'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-500">
        아직 계정이 없으신가요?{' '}
        <button
          type="button"
          onClick={() => navigate('/signup')}
          className="font-semibold text-indigo-600 underline-offset-2 hover:underline"
        >
          회원가입
        </button>
      </p>

      <div className="mt-6 flex items-center gap-3 text-xs text-slate-400">
        <div className="h-px flex-1 bg-slate-200" />
        간편 로그인
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <button
          type="button"
          onClick={() => {
            window.location.href = getSocialLoginUrl('kakao');
          }}
          className="flex h-12 w-full items-center justify-center gap-2.5 rounded-2xl bg-[#FEE500] text-sm font-bold text-[#191919] shadow-sm transition hover:opacity-95"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9 2.5C5.13401 2.5 2 4.8505 2 7.75C2 9.6105 3.28427 11.238 5.22802 12.1865L4.40602 15.1975C4.35902 15.371 4.45977 15.551 4.63077 15.5995C4.69377 15.6175 4.76002 15.6145 4.82102 15.5915L8.51402 13.0675C8.67402 13.0805 8.83602 13.0875 9 13.0875C12.866 13.0875 16 10.737 16 7.8375C16 4.938 12.866 2.5875 9 2.5875V2.5Z"
              fill="#191919"
            />
          </svg>
          카카오로 로그인
        </button>

        <button
          type="button"
          onClick={() => {
            window.location.href = getSocialLoginUrl('google');
          }}
          className="flex h-12 w-full items-center justify-center gap-2.5 rounded-2xl border border-[#dadce0] bg-white text-sm font-bold text-[#3c4043] shadow-sm transition hover:bg-gray-50"
        >
          <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
          </svg>
          구글로 로그인
        </button>
      </div>
    </section>
  );
};

export default LoginForm;
