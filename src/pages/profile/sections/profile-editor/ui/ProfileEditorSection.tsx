import { useState } from 'react';
import { PencilLine, X } from 'lucide-react';
import { useProfileEditor } from '@/features/profile/update';
import ProfileEditorForm from './ProfileEditorForm';
import ProfileEditorHero from './ProfileEditorHero';
import ProfileEditorStatus from './ProfileEditorStatus';

const ProfileEditorSection = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const {
    profile,
    isLoading,
    isError,
    error,
    refetch,
    imageError,
    fileInputRef,
    isUploadPending,
    uploadErrorMessage,
    saveMessage,
    saveMessageTone,
    isSavePending,
    setImageError,
    handleFieldChange,
    handleImageButtonClick,
    handleImageFileChange,
    handleSave,
    resetDraft,
  } = useProfileEditor({ onSaveSuccess: () => setIsEditMode(false) });

  const displayNickname = profile.nickname.trim() || '익명 사용자';

  if (isLoading || isError) {
    return (
      <ProfileEditorStatus
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  const handleToggleEdit = () => {
    if (isEditMode) {
      resetDraft();
    }
    setIsEditMode((current) => !current);
  };

  return (
    <section className="rounded-[32px] bg-white px-6 py-8 shadow-sm sm:px-8 md:px-10 md:py-10">
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-indigo-500">공개 프로필</p>
          <p className="mt-1 text-sm text-slate-500">다른 사용자에게 보이는 정보예요.</p>
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
      <ProfileEditorHero
        profile={profile}
        displayNickname={displayNickname}
        isEditMode={isEditMode}
        imageError={imageError}
        setImageError={setImageError}
        fileInputRef={fileInputRef}
        isUploadPending={isUploadPending}
        uploadErrorMessage={uploadErrorMessage}
        onImageButtonClick={handleImageButtonClick}
        onImageFileChange={handleImageFileChange}
      />
      <ProfileEditorForm
        profile={profile}
        isEditMode={isEditMode}
        saveMessage={saveMessage}
        saveMessageTone={saveMessageTone}
        isSavePending={isSavePending}
        onFieldChange={handleFieldChange}
        onSave={handleSave}
      />
    </section>
  );
};

export default ProfileEditorSection;
