import { useId } from 'react';
import { useForm } from 'react-hook-form';
import { MBTI_OPTIONS, type Gender, type MbtiType } from '@/entities/user';
import AuthField from '@/shared/ui/auth/AuthField';
import AuthSubmitButton from '@/shared/ui/auth/AuthSubmitButton';

interface SignUpFormProps {
  onSuccess: () => void;
}

interface SignUpFormValues {
  name: string;
  nickname: string;
  email: string;
  password: string;
  passwordConfirm: string;
  birthDate: string;
  gender: Gender | '';
  schoolInfo: string;
  introduce: string;
  mbti: MbtiType | '';
}

const GENDER_OPTIONS = [
  { value: 'MALE', label: '남성' },
  { value: 'FEMALE', label: '여성' },
] as const;

const SignUpForm = ({ onSuccess }: SignUpFormProps) => {
  const signupNameId = useId();
  const signupNicknameId = useId();
  const signupEmailId = useId();
  const signupPasswordId = useId();
  const signupPasswordConfirmId = useId();
  const signupBirthDateId = useId();
  const signupSchoolInfoId = useId();
  const signupIntroduceId = useId();
  const signUpForm = useForm<SignUpFormValues>({
    defaultValues: {
      name: '',
      nickname: '',
      email: '',
      password: '',
      passwordConfirm: '',
      birthDate: '',
      gender: '',
      schoolInfo: '',
      introduce: '',
      mbti: '',
    },
  });

  const gender = signUpForm.watch('gender');
  const mbti = signUpForm.watch('mbti');
  const { errors } = signUpForm.formState;

  const onSubmit = signUpForm.handleSubmit((data) => {
    if (!data.gender) {
      signUpForm.setError('gender', { message: '성별을 선택해 주세요.' });
      return;
    }
    onSuccess();
  });

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)]"
    >
      <div className="space-y-4 mb-5">
        <AuthField
          id={signupNameId}
          type="text"
          label="이름"
          placeholder="이름을 입력하세요"
          inputClassName="h-13"
          registration={signUpForm.register('name', { required: '이름을 입력해 주세요.' })}
          error={errors.name?.message}
        />
        <AuthField
          id={signupNicknameId}
          type="text"
          label="닉네임"
          placeholder="닉네임을 입력하세요"
          inputClassName="h-13"
          registration={signUpForm.register('nickname', { required: '닉네임을 입력해 주세요.' })}
          error={errors.nickname?.message}
        />
        <AuthField
          id={signupEmailId}
          type="email"
          label="이메일"
          placeholder="example@university.ac.kr"
          inputClassName="h-13"
          registration={signUpForm.register('email', {
            required: '이메일을 입력해 주세요.',
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: '이메일 형식이 올바르지 않습니다.',
            },
          })}
          error={errors.email?.message}
        />
        <AuthField
          id={signupPasswordId}
          type="password"
          label="비밀번호"
          placeholder="비밀번호를 입력하세요"
          inputClassName="h-13"
          registration={signUpForm.register('password', {
            required: '비밀번호를 입력해 주세요.',
            minLength: { value: 8, message: '비밀번호는 8자 이상이어야 합니다.' },
          })}
          error={errors.password?.message}
        />
        <AuthField
          id={signupPasswordConfirmId}
          type="password"
          label="비밀번호 확인"
          placeholder="비밀번호를 다시 입력하세요"
          inputClassName="h-13"
          registration={signUpForm.register('passwordConfirm', {
            required: '비밀번호를 다시 입력해 주세요.',
            validate: (value) =>
              value === signUpForm.watch('password') || '비밀번호가 일치하지 않습니다.',
          })}
          error={errors.passwordConfirm?.message}
        />
        <AuthField
          id={signupBirthDateId}
          type="date"
          label="생년월일"
          placeholder="생년월일을 입력하세요"
          inputClassName="h-13"
          registration={signUpForm.register('birthDate', {
            required: '생년월일을 입력해 주세요.',
          })}
          error={errors.birthDate?.message}
        />
        <div className="space-y-2.5">
          <span className="text-sm font-semibold text-slate-900">성별</span>
          <div className="grid grid-cols-2 gap-3">
            {GENDER_OPTIONS.map((option) => {
              const isSelected = gender === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    signUpForm.setValue('gender', option.value);
                    signUpForm.clearErrors('gender');
                  }}
                  aria-pressed={isSelected}
                  className={`h-13 rounded-2xl border text-sm font-semibold transition ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-500 text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-slate-50'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          {errors.gender && <p className="pl-1 text-xs text-red-500">{errors.gender.message}</p>}
        </div>
        <AuthField
          id={signupSchoolInfoId}
          type="text"
          label="학교 정보"
          placeholder="학교 정보를 입력하세요 (선택)"
          inputClassName="h-13"
          registration={signUpForm.register('schoolInfo')}
        />
        <AuthField
          id={signupIntroduceId}
          type="text"
          label="자기소개"
          placeholder="자기소개를 입력하세요 (선택)"
          inputClassName="h-13"
          registration={signUpForm.register('introduce')}
        />
        <div className="space-y-2.5">
          <span className="text-sm font-semibold text-slate-900">MBTI</span>
          <div className="grid grid-cols-4 gap-2">
            {MBTI_OPTIONS.map((option) => {
              const isSelected = mbti === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => signUpForm.setValue('mbti', option)}
                  aria-pressed={isSelected}
                  className={`h-11 rounded-2xl border text-sm font-semibold transition ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-500 text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-slate-50'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <AuthSubmitButton label="회원가입" />
    </form>
  );
};

export default SignUpForm;
