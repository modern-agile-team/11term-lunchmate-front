import { useQuery } from '@tanstack/react-query';
import { LogOut, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router';
import { myUserQueryOptions } from '@/entities/user';
import { useAccountActions, useProfileImageEditor } from '@/features/profile/update';
import { KST_TIME_ZONE } from '@/shared/lib/date/formatKST';
import InfoRow from '@/shared/ui/InfoRow';
import ProfileEditorForm from './ProfileEditorForm';
import ProfileEditorHero from './ProfileEditorHero';
import ProfileEditorStatus from './ProfileEditorStatus';

const ProfileEditorSection = () => {
  const navigate = useNavigate();
  const userQuery = useQuery(myUserQueryOptions());
  const {
    imageError,
    setImageError,
    fileInputRef,
    isUploadPending,
    uploadErrorMessage,
    handleImageButtonClick,
    handleImageFileChange,
  } = useProfileImageEditor();
  const { handleLogout, isLogoutPending, isDeletePending, handleDeleteAccount } =
    useAccountActions();

  if (userQuery.isLoading || userQuery.isError || !userQuery.data) {
    return (
      <ProfileEditorStatus
        isLoading={userQuery.isLoading}
        isError={userQuery.isError}
        error={userQuery.error}
        onRetry={() => userQuery.refetch()}
      />
    );
  }

  const user = userQuery.data;
  const displayNickname = user.nickname.trim() || '익명 사용자';

  return (
    <section className="rounded-[32px] bg-white px-6 py-8 shadow-sm sm:px-8 md:px-10 md:py-10">
      <div className="mb-6">
        <p className="text-sm font-semibold text-indigo-500">프로필</p>
        <p className="mt-1 text-sm text-slate-500">
          항목별로 수정 아이콘을 눌러 바로 저장할 수 있어요.
        </p>
      </div>
      <ProfileEditorHero
        nickname={user.nickname}
        profileImageUrl={user.profileImageUrl}
        displayNickname={displayNickname}
        imageError={imageError}
        setImageError={setImageError}
        fileInputRef={fileInputRef}
        isUploadPending={isUploadPending}
        uploadErrorMessage={uploadErrorMessage}
        onImageButtonClick={handleImageButtonClick}
        onImageFileChange={handleImageFileChange}
      />

      <InfoRow label="이메일">
        <p className="text-sm text-slate-700 sm:text-base">{user.email}</p>
      </InfoRow>

      <ProfileEditorForm user={user} />

      <div className="mt-2">
        <InfoRow label="가입일" withBorder={false}>
          <p className="text-sm text-slate-700 sm:text-base">
            {new Date(user.createdAt).toLocaleDateString('ko-KR', { timeZone: KST_TIME_ZONE })}
          </p>
        </InfoRow>
      </div>

      <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
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
    </section>
  );
};

export default ProfileEditorSection;
