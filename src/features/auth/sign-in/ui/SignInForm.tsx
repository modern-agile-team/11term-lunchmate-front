import { Eye } from 'lucide-react';
import { useId } from 'react';
import { useForm } from 'react-hook-form';

interface SignInFormProps {
  onSuccess: () => void;
  onSwitchToSignUp: () => void;
}

interface SignInFormValues {
  email: string;
  password: string;
}

const SignInForm = ({ onSuccess, onSwitchToSignUp }: SignInFormProps) => {
  const emailId = useId();
  const passwordId = useId();
  const signInForm = useForm<SignInFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <form
      onSubmit={signInForm.handleSubmit(() => {
        onSuccess();
      })}
      className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)] md:p-7"
    >
      <div className="space-y-5">
        <div className="space-y-2.5">
          <label htmlFor={emailId} className="text-sm font-semibold text-slate-900">
            이메일
          </label>
          <input
            id={emailId}
            type="email"
            placeholder="example@university.ac.kr"
            className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
            {...signInForm.register('email')}
          />
        </div>

        <div className="space-y-2.5">
          <label htmlFor={passwordId} className="text-sm font-semibold text-slate-900">
            비밀번호
          </label>
          <div className="relative">
            <input
              id={passwordId}
              type="password"
              placeholder="비밀번호를 입력하세요"
              className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 pr-12 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
              {...signInForm.register('password')}
            />
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
              <Eye className="h-5 w-5" />
            </span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 inline-flex h-14 w-full items-center justify-center rounded-2xl bg-indigo-500 text-base font-semibold text-white transition hover:bg-indigo-600"
      >
        로그인
      </button>

      <p className="mt-5 text-center text-sm text-slate-500">
        아직 계정이 없으신가요?{' '}
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="font-semibold text-indigo-500 hover:text-indigo-600"
        >
          회원가입
        </button>
      </p>
    </form>
  );
};

export default SignInForm;
