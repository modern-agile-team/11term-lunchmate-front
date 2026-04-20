import { Eye } from 'lucide-react';
import { useId } from 'react';
import { useForm } from 'react-hook-form';

interface SignUpFormProps {
  onSuccess: () => void;
  onSwitchToSignIn: () => void;
}

interface SignUpFormValues {
  name: string;
  nickname: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

const SignUpForm = ({ onSuccess, onSwitchToSignIn }: SignUpFormProps) => {
  const signupNameId = useId();
  const signupNicknameId = useId();
  const signupEmailId = useId();
  const signupPasswordId = useId();
  const signupPasswordConfirmId = useId();
  const signUpForm = useForm<SignUpFormValues>({
    defaultValues: {
      name: '',
      nickname: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },
  });

  return (
    <form
      onSubmit={signUpForm.handleSubmit(() => {
        onSuccess();
      })}
      className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)] md:p-7"
    >
      <div className="space-y-4">
        <div className="space-y-2.5">
          <label htmlFor={signupNameId} className="text-sm font-semibold text-slate-900">
            이름
          </label>
          <input
            id={signupNameId}
            type="text"
            placeholder="이름을 입력하세요"
            className="h-13 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
            {...signUpForm.register('name')}
          />
        </div>

        <div className="space-y-2.5">
          <label htmlFor={signupNicknameId} className="text-sm font-semibold text-slate-900">
            닉네임
          </label>
          <input
            id={signupNicknameId}
            type="text"
            placeholder="닉네임을 입력하세요"
            className="h-13 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
            {...signUpForm.register('nickname')}
          />
        </div>

        <div className="space-y-2.5">
          <label htmlFor={signupEmailId} className="text-sm font-semibold text-slate-900">
            이메일
          </label>
          <input
            id={signupEmailId}
            type="email"
            placeholder="example@university.ac.kr"
            className="h-13 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
            {...signUpForm.register('email')}
          />
        </div>

        <div className="space-y-2.5">
          <label htmlFor={signupPasswordId} className="text-sm font-semibold text-slate-900">
            비밀번호
          </label>
          <div className="relative">
            <input
              id={signupPasswordId}
              type="password"
              placeholder="비밀번호를 입력하세요"
              className="h-13 w-full rounded-2xl border border-slate-200 bg-white px-4 pr-12 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
              {...signUpForm.register('password')}
            />
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
              <Eye className="h-5 w-5" />
            </span>
          </div>
        </div>

        <div className="space-y-2.5">
          <label
            htmlFor={signupPasswordConfirmId}
            className="text-sm font-semibold text-slate-900"
          >
            비밀번호 확인
          </label>
          <div className="relative">
            <input
              id={signupPasswordConfirmId}
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              className="h-13 w-full rounded-2xl border border-slate-200 bg-white px-4 pr-12 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
              {...signUpForm.register('passwordConfirm')}
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
        회원가입
      </button>

      <p className="mt-5 text-center text-sm text-slate-500">
        이미 계정이 있으신가요?{' '}
        <button
          type="button"
          onClick={onSwitchToSignIn}
          className="font-semibold text-indigo-500 hover:text-indigo-600"
        >
          로그인
        </button>
      </p>
    </form>
  );
};

export default SignUpForm;
