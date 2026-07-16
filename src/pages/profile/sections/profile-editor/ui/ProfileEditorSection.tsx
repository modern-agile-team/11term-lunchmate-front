import { useProfileEditor } from '@/features/profile/update';
import ProfileEditorForm from './ProfileEditorForm';
import ProfileEditorHero from './ProfileEditorHero';
import ProfileEditorStatus from './ProfileEditorStatus';

const ProfileEditorSection = () => {
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
  } = useProfileEditor();

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

  return (
    <section className="mx-auto w-full max-w-4xl rounded-[32px] bg-white px-6 py-8 shadow-sm sm:px-8 md:px-10 md:py-10">
      <ProfileEditorHero
        profile={profile}
        displayNickname={displayNickname}
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
