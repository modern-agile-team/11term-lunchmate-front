import { useForm } from 'react-hook-form';
import { LogIn, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { setAuthAccessToken } from '@/shared/lib/auth/session';
import client from '@/shared/api/client';
import axios from 'axios';

interface LoginInput {
  email: string;
  password: string;
}

const LoginForm = () => {
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: async (loginData: LoginInput) => {
      const response = await client.post('/api/v1/auth/login', loginData);
      return response.data; // { user, accessToken, refreshToken }
    },
    onSuccess: (data) => {
      setAuthAccessToken(data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      alert(`${data.user.nickname || data.user.name}님, 환영합니다!`);
      navigate('/api/v1/users/me');
    },
    onError: (err: unknown) => {
      if (axios.isAxiosError(err)) {
        const errMsg =
          err.response?.status === 401
            ? '이메일 또는 비밀번호가 틀렸습니다.'
            : '로그인 중 오류가 발생했습니다.';
        alert(errMsg);
      }
    },
  });

  const onSubmit = (data: LoginInput) => {
    mutate(data);
  };

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

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        {/* 이메일 필드 (명세서의 email) */}
        <div className="space-y-1">
          <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
            이메일
          </label>
          <input
            id="email"
            type="email"
            {...register('email', {
              required: '이메일을 입력해 주세요.',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: '이메일 형식이 올바르지 않습니다.',
              },
            })}
            className={`h-12 w-full rounded-2xl border px-4 text-sm transition outline-none ${
              errors.email
                ? 'border-red-400 bg-red-50'
                : 'border-slate-200 bg-slate-50 focus:border-indigo-300 focus:bg-white'
            }`}
            placeholder="example@email.com"
          />
          {errors.email && (
            <p className="text-xs text-red-500 pl-1">{errors.email.message as string}</p>
          )}
        </div>

        {/* 비밀번호 필드 */}
        <div className="space-y-1">
          <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            {...register('password', { required: '비밀번호를 입력해 주세요.' })}
            className={`h-12 w-full rounded-2xl border px-4 text-sm transition outline-none ${
              errors.password
                ? 'border-red-400 bg-red-50'
                : 'border-slate-200 bg-slate-50 focus:border-indigo-300 focus:bg-white'
            }`}
            placeholder="비밀번호를 입력하세요"
          />
          {errors.password && (
            <p className="text-xs text-red-500 pl-1">{errors.password.message as string}</p>
          )}
        </div>

        {isError && (
          <p className="text-xs text-red-500 text-center font-medium">
            인증 정보가 일치하지 않습니다.
          </p>
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
    </section>
  );
};

export default LoginForm;
