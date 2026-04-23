import { Eye } from 'lucide-react';
import { useId } from 'react';
import { useForm } from 'react-hook-form';
import AuthField from '@/shared/ui/auth/AuthField';
import AuthSubmitButton from '@/shared/ui/auth/AuthSubmitButton';

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
        <AuthField
          id={signupNameId}
          type="text"
          label="이름"
          placeholder="이름을 입력하세요"
          inputClassName="h-13"
          registration={signUpForm.register('name')}
        />
        <AuthField
          id={signupNicknameId}
          type="text"
          label="닉네임"
          placeholder="닉네임을 입력하세요"
          inputClassName="h-13"
          registration={signUpForm.register('nickname')}
        />
        <AuthField
          id={signupEmailId}
          type="email"
          label="이메일"
          placeholder="example@university.ac.kr"
          inputClassName="h-13"
          registration={signUpForm.register('email')}
        />
        <AuthField
          id={signupPasswordId}
          type="password"
          label="비밀번호"
          placeholder="비밀번호를 입력하세요"
          inputClassName="h-13"
          trailing={<Eye className="h-5 w-5" />}
          registration={signUpForm.register('password')}
        />
        <AuthField
          id={signupPasswordConfirmId}
          type="password"
          label="비밀번호 확인"
          placeholder="비밀번호를 다시 입력하세요"
          inputClassName="h-13"
          trailing={<Eye className="h-5 w-5" />}
          registration={signUpForm.register('passwordConfirm')}
        />
      </div>

      <AuthSubmitButton label="회원가입" />

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
