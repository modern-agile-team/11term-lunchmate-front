import { useState } from 'react';
import { LogOut, PencilLine, ShieldAlert, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import InfoRow from '@/shared/ui/InfoRow';
import { useAccountSettings } from '../model/useAccountSettings';

const AccountSettingsSection = () => {
  const [isEditMode, setIsEditMode] = useState(false);
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
    handleSave,
    resetForm,
    handleLogout,
    handleDeleteAccount,
  } = useAccountSettings({ onSaveSuccess: () => setIsEditMode(false) });

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

  const handleToggleEdit = () => {
    if (isEditMode) {
      resetForm();
    }
    setIsEditMode((current) => !current);
  };

  return (
    <section className="rounded-[28px] bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-indigo-500">계정 관리</p>
          <p className="mt-2 text-sm text-slate-500">다른 사용자에게 보이지 않는 계정 정보예요.</p>
        </div>
        <button
          type="button"
          onClick={handleToggleEdit}
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          {isEditMode ? <X className="h-4 w-4" /> : <PencilLine className="h-4 w-4" />}
          {isEditMode ? '취소' : '수정'}
        </button>
      </div>

      <div className="mt-8">
        <InfoRow label="이름">
          {isEditMode ? (
            <input
              type="text"
              value={form.name}
              onChange={(event) => handleFieldChange('name', event.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-indigo-300 focus:bg-white"
            />
          ) : (
            <p className="text-sm text-slate-700">{user.name || '이름이 아직 없어요.'}</p>
          )}
        </InfoRow>

        <InfoRow label="이메일">
          {isEditMode ? (
            <input
              type="email"
              value={form.email}
              onChange={(event) => handleFieldChange('email', event.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-indigo-300 focus:bg-white"
            />
          ) : (
            <p className="text-sm text-slate-700">{user.email}</p>
          )}
        </InfoRow>

        <InfoRow label="생년월일">
          {isEditMode ? (
            <input
              type="date"
              value={form.birthDate}
              onChange={(event) => handleFieldChange('birthDate', event.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-indigo-300 focus:bg-white"
            />
          ) : (
            <p className="text-sm text-slate-700">{user.birthDate || '미입력'}</p>
          )}
        </InfoRow>

        <InfoRow label="가입일" withBorder={false}>
          <p className="text-sm text-slate-700">
            {new Date(user.createdAt).toLocaleDateString('ko-KR')}
          </p>
        </InfoRow>
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

      <div
        className={`mt-8 flex flex-col gap-3 sm:flex-row sm:items-center ${isEditMode ? 'sm:justify-between' : 'sm:justify-end'}`}
      >
        {isEditMode ? (
          <button
            type="button"
            onClick={handleSave}
            disabled={isSavePending}
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-70"
          >
            {isSavePending ? '저장 중...' : '계정 정보 저장'}
          </button>
        ) : null}

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
