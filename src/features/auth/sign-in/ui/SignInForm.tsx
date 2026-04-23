import { Eye } from 'lucide-react';
import { useId } from 'react';
import { useForm } from 'react-hook-form';
import AuthField from '@/shared/ui/auth/AuthField';
import AuthSubmitButton from '@/shared/ui/auth/AuthSubmitButton';

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
        <AuthField
          id={emailId}
          type="email"
          label="이메일"
          placeholder="example@university.ac.kr"
          registration={signInForm.register('email')}
        />
        <AuthField
          id={passwordId}
          type="password"
          label="비밀번호"
          placeholder="비밀번호를 입력하세요"
          trailing={<Eye className="h-5 w-5" />}
          registration={signInForm.register('password')}
        />
      </div>

      <AuthSubmitButton label="로그인" />

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
