import { LogOut, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAccountSettings } from '../model/useAccountSettings';

const GENDER_OPTIONS = [
  { value: 'ANY', label: '선택 안 함' },
  { value: 'MALE', label: '남성' },
  { value: 'FEMALE', label: '여성' },
] as const;

const AccountSettingsSection = () => {
  const navigate = useNavigate();
  const {
    user,
    form,
    isLoading,
    isError,
    error,
    refetch,
    message,
    messageTone,
    isSavePending,
    isLogoutPending,
    isDeletePending,
    handleFieldChange,
    handleGenderChange,
    handleSave,
    handleLogout,
    handleDeleteAccount,
  } = useAccountSettings();

  if (isLoading) {
    return (
      <section className="rounded-[28px] bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">계정 정보를 불러오는 중입니다.</p>
      </section>
    );
  }

  if (isError || !user) {
    return (
      <section className="rounded-[28px] bg-white p-6 shadow-sm">
        <p className="text-sm text-red-500">
          {(error as Error | null)?.message ?? '계정 정보를 불러오지 못했습니다.'}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
        >
          다시 시도
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-[28px] bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-indigo-500">계정 관리</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            로그인, 로그아웃, 회원 정보 관리
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            이메일, 생년월일, 성별 같은 계정 정보를 여기서 수정할 수 있어요.
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          가입일 {new Date(user.createdAt).toLocaleDateString('ko-KR')}
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">이름</span>
          <input
            type="text"
            value={form.name}
            onChange={(event) => handleFieldChange('name', event.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-indigo-300 focus:bg-white"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">이메일</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => handleFieldChange('email', event.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-indigo-300 focus:bg-white"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">생년월일</span>
          <input
            type="date"
            value={form.birthDate}
            onChange={(event) => handleFieldChange('birthDate', event.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-indigo-300 focus:bg-white"
          />
        </label>

        <div className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">성별</span>
          <div className="grid grid-cols-3 gap-2">
            {GENDER_OPTIONS.map((option) => {
              const isSelected = form.gender === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleGenderChange(option.value)}
                  className={`h-12 rounded-2xl border text-sm font-semibold transition ${
                    isSelected
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-indigo-200 hover:bg-white'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {message ? (
        <p
          className={`mt-4 text-sm font-medium ${
            messageTone === 'success' ? 'text-emerald-600' : 'text-red-500'
          }`}
        >
          {message}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSavePending}
          className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-70"
        >
          {isSavePending ? '저장 중...' : '계정 정보 저장'}
        </button>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              handleLogout();
              navigate('/');
            }}
            disabled={isLogoutPending}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-70"
          >
            <LogOut className="h-4 w-4" />
            {isLogoutPending ? '로그아웃 중...' : '로그아웃'}
          </button>

          <button
            type="button"
            onClick={() => {
              if (!window.confirm('정말 회원탈퇴할까요? 이 작업은 되돌릴 수 없습니다.')) {
                return;
              }

              handleDeleteAccount();
              navigate('/');
            }}
            disabled={isDeletePending}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-red-200 px-5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-70"
          >
            <ShieldAlert className="h-4 w-4" />
            {isDeletePending ? '처리 중...' : '회원탈퇴'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default AccountSettingsSection;
