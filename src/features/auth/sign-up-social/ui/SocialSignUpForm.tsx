import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useId } from 'react';
import { useForm } from 'react-hook-form';
import {
  myUserQueryOptions,
  registerSocial,
  type Gender,
  type MbtiType,
  MBTI_OPTIONS,
} from '@/entities/user';
import { setAuthTokens } from '@/shared/lib/auth/session';
import AuthField from '@/shared/ui/auth/AuthField';
import AuthSubmitButton from '@/shared/ui/auth/AuthSubmitButton';

interface SocialSignUpFormProps {
  onSuccess: () => void;
}

interface SocialSignUpFormValues {
  nickname: string;
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

const SocialSignUpForm = ({ onSuccess }: SocialSignUpFormProps) => {
  const socialNicknameId = useId();
  const socialBirthYearId = useId();
  const socialBirthMonthId = useId();
  const socialBirthDayId = useId();
  const socialSchoolInfoId = useId();
  const socialIntroduceId = useId();
  const socialSignUpForm = useForm<SocialSignUpFormValues>({
    defaultValues: {
      nickname: '',
      birthYear: '',
      birthMonth: '',
      birthDay: '',
      gender: '',
      schoolInfo: '',
      introduce: '',
      mbti: '',
    },
  });

  const gender = socialSignUpForm.watch('gender');
  const mbti = socialSignUpForm.watch('mbti');
  const { errors } = socialSignUpForm.formState;
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: registerSocial,
    onSuccess: (data) => {
      setAuthTokens(data.accessToken, data.refreshToken);
      queryClient.setQueryData(myUserQueryOptions().queryKey, data.user);
      onSuccess();
    },
    onError: (err: unknown) => {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        socialSignUpForm.setError('root', {
          message: '소셜 인증 정보가 만료되었습니다. 다시 로그인해 주세요.',
        });
        return;
      }

      if (axios.isAxiosError(err) && err.response?.status === 409) {
        const data = err.response.data as { message?: string } | undefined;
        socialSignUpForm.setError('nickname', {
          message: data?.message || '이미 사용 중인 닉네임입니다.',
        });
        return;
      }

      socialSignUpForm.setError('root', { message: '회원가입 중 오류가 발생했습니다.' });
    },
  });

  const onSubmit = socialSignUpForm.handleSubmit((data) => {
    if (!data.gender) {
      socialSignUpForm.setError('gender', { message: '성별을 선택해 주세요.' });
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
      socialSignUpForm.setError('birthYear', { message: '생년월일을 확인해 주세요.' });
      return;
    }

    const birthDate = `${data.birthYear}-${data.birthMonth.padStart(2, '0')}-${data.birthDay.padStart(2, '0')}`;

    mutate({
      nickname: data.nickname.trim(),
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
          id={socialNicknameId}
          type="text"
          label="닉네임"
          placeholder="닉네임을 입력하세요"
          inputClassName="h-13"
          registration={socialSignUpForm.register('nickname', {
            validate: (value) => value.trim().length > 0 || '닉네임을 입력해 주세요.',
          })}
          error={errors.nickname?.message}
        />
        <div className="space-y-2.5">
          <span className="text-sm font-semibold text-slate-900">생년월일</span>
          <div className="grid grid-cols-3 gap-2">
            <input
              id={socialBirthYearId}
              type="number"
              placeholder="년도"
              aria-label="출생 연도"
              className={`h-13 w-full rounded-2xl border bg-white px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                errors.birthYear
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                  : 'border-slate-200 focus:border-indigo-300 focus:ring-indigo-100'
              }`}
              {...socialSignUpForm.register('birthYear', {
                required: '생년월일을 입력해 주세요.',
                pattern: { value: /^\d{4}$/, message: '생년월일을 확인해 주세요.' },
              })}
            />
            <input
              id={socialBirthMonthId}
              type="number"
              placeholder="월"
              aria-label="출생 월"
              className={`h-13 w-full rounded-2xl border bg-white px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                errors.birthMonth
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                  : 'border-slate-200 focus:border-indigo-300 focus:ring-indigo-100'
              }`}
              {...socialSignUpForm.register('birthMonth', {
                required: '생년월일을 입력해 주세요.',
                pattern: { value: /^(0?[1-9]|1[0-2])$/, message: '생년월일을 확인해 주세요.' },
              })}
            />
            <input
              id={socialBirthDayId}
              type="number"
              placeholder="일"
              aria-label="출생 일"
              className={`h-13 w-full rounded-2xl border bg-white px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                errors.birthDay
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                  : 'border-slate-200 focus:border-indigo-300 focus:ring-indigo-100'
              }`}
              {...socialSignUpForm.register('birthDay', {
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
                    socialSignUpForm.setValue('gender', option.value);
                    socialSignUpForm.clearErrors('gender');
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
          id={socialSchoolInfoId}
          type="text"
          label="학교 정보"
          placeholder="학교 정보를 입력하세요 (선택)"
          inputClassName="h-13"
          registration={socialSignUpForm.register('schoolInfo')}
        />
        <AuthField
          id={socialIntroduceId}
          type="text"
          label="자기소개"
          placeholder="자기소개를 입력하세요 (선택)"
          inputClassName="h-13"
          registration={socialSignUpForm.register('introduce')}
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
                  onClick={() => socialSignUpForm.setValue('mbti', option)}
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

      <AuthSubmitButton label="가입 완료" pendingLabel="가입 중..." isPending={isPending} />
    </form>
  );
};

export default SocialSignUpForm;
