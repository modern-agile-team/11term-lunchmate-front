import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useId, type ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import {
  myProfileQueryOptions,
  myUserQueryOptions,
  signup,
  type Gender,
  type MbtiType,
  MBTI_OPTIONS,
} from '@/entities/user';
import { setAuthAccessToken } from '@/shared/lib/auth/session';
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
  birthYear: string;
  birthMonth: string;
  birthDay: string;
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
  const signupBirthYearId = useId();
  const signupBirthMonthId = useId();
  const signupBirthDayId = useId();
  const signupSchoolInfoId = useId();
  const signupIntroduceId = useId();
  const signUpForm = useForm<SignUpFormValues>({
    defaultValues: {
      name: '',
      nickname: '',
      email: '',
      password: '',
      passwordConfirm: '',
      birthYear: '',
      birthMonth: '',
      birthDay: '',
      gender: '',
      schoolInfo: '',
      introduce: '',
      mbti: '',
    },
  });

  const gender = signUpForm.watch('gender');
  const mbti = signUpForm.watch('mbti');
  const { errors } = signUpForm.formState;
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: signup,
    onSuccess: async (data) => {
      setAuthAccessToken(data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      queryClient.setQueryData(myUserQueryOptions().queryKey, data.user);
      await queryClient.invalidateQueries({ queryKey: myProfileQueryOptions().queryKey });
      onSuccess();
    },
    onError: (err: unknown) => {
      const message =
        axios.isAxiosError(err) && err.response?.status === 409
          ? '이미 가입된 이메일입니다.'
          : '회원가입 중 오류가 발생했습니다.';
      signUpForm.setError('root', { message });
    },
  });

  const passwordRegistration = signUpForm.register('password', {
    required: '비밀번호를 입력해 주세요.',
    minLength: { value: 8, message: '비밀번호는 8자 이상이어야 합니다.' },
  });

  const onSubmit = signUpForm.handleSubmit((data) => {
    if (!data.gender) {
      signUpForm.setError('gender', { message: '성별을 선택해 주세요.' });
      return;
    }

    const year = Number(data.birthYear);
    const month = Number(data.birthMonth);
    const day = Number(data.birthDay);
    const birthDateObj = new Date(year, month - 1, day);
    const isRealDate =
      birthDateObj.getFullYear() === year &&
      birthDateObj.getMonth() === month - 1 &&
      birthDateObj.getDate() === day;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!isRealDate || birthDateObj > today || year < 1900) {
      signUpForm.setError('birthYear', { message: '생년월일을 확인해 주세요.' });
      return;
    }

    const birthDate = `${data.birthYear}-${data.birthMonth.padStart(2, '0')}-${data.birthDay.padStart(2, '0')}`;

    mutate({
      name: data.name.trim(),
      nickname: data.nickname.trim(),
      email: data.email.trim(),
      password: data.password,
      birthDate,
      gender: data.gender,
      schoolInfo: data.schoolInfo.trim() || undefined,
      introduce: data.introduce.trim() || undefined,
      mbti: data.mbti || undefined,
    });
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
          registration={signUpForm.register('name', {
            validate: (value) => value.trim().length > 0 || '이름을 입력해 주세요.',
          })}
          error={errors.name?.message}
        />
        <AuthField
          id={signupNicknameId}
          type="text"
          label="닉네임"
          placeholder="닉네임을 입력하세요"
          inputClassName="h-13"
          registration={signUpForm.register('nickname', {
            validate: (value) => value.trim().length > 0 || '닉네임을 입력해 주세요.',
          })}
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
          registration={{
            ...passwordRegistration,
            onChange: (event: ChangeEvent<HTMLInputElement>) => {
              passwordRegistration.onChange(event);
              if (signUpForm.getValues('passwordConfirm')) {
                void signUpForm.trigger('passwordConfirm');
              }
            },
          }}
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
        <div className="space-y-2.5">
          <span className="text-sm font-semibold text-slate-900">생년월일</span>
          <div className="grid grid-cols-3 gap-2">
            <input
              id={signupBirthYearId}
              type="number"
              placeholder="년도"
              aria-label="출생 연도"
              className={`h-13 w-full rounded-2xl border bg-white px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                errors.birthYear
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                  : 'border-slate-200 focus:border-indigo-300 focus:ring-indigo-100'
              }`}
              {...signUpForm.register('birthYear', {
                required: '생년월일을 입력해 주세요.',
                pattern: { value: /^\d{4}$/, message: '생년월일을 확인해 주세요.' },
              })}
            />
            <input
              id={signupBirthMonthId}
              type="number"
              placeholder="월"
              aria-label="출생 월"
              className={`h-13 w-full rounded-2xl border bg-white px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                errors.birthMonth
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                  : 'border-slate-200 focus:border-indigo-300 focus:ring-indigo-100'
              }`}
              {...signUpForm.register('birthMonth', {
                required: '생년월일을 입력해 주세요.',
                pattern: { value: /^(0?[1-9]|1[0-2])$/, message: '생년월일을 확인해 주세요.' },
              })}
            />
            <input
              id={signupBirthDayId}
              type="number"
              placeholder="일"
              aria-label="출생 일"
              className={`h-13 w-full rounded-2xl border bg-white px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                errors.birthDay
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                  : 'border-slate-200 focus:border-indigo-300 focus:ring-indigo-100'
              }`}
              {...signUpForm.register('birthDay', {
                required: '생년월일을 입력해 주세요.',
                pattern: {
                  value: /^(0?[1-9]|[12]\d|3[01])$/,
                  message: '생년월일을 확인해 주세요.',
                },
              })}
            />
          </div>
          {(errors.birthYear || errors.birthMonth || errors.birthDay) && (
            <p className="pl-1 text-xs text-red-500">
              {errors.birthYear?.message ?? errors.birthMonth?.message ?? errors.birthDay?.message}
            </p>
          )}
        </div>
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

      {errors.root && (
        <p className="mb-2 text-center text-xs font-medium text-red-500">{errors.root.message}</p>
      )}

      <AuthSubmitButton label="회원가입" pendingLabel="가입 중..." isPending={isPending} />
    </form>
  );
};

export default SignUpForm;
