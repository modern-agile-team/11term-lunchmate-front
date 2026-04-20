import { MBTI_OPTIONS, ProfileAvatar } from '@/entities/user';
import { ProfileImageEditor, ProfileSaveButton, useProfileEditor } from '@/features/profile/update';

const ProfileEditorSection = () => {
  const {
    profile,
    isLoading,
    isError,
    error,
    refetch,
    imageInputValue,
    isImageEditorOpen,
    imageError,
    saveMessage,
    saveMessageTone,
    isSavePending,
    setImageInputValue,
    setImageError,
    handleFieldChange,
    handleImageApply,
    handleImageEditorToggle,
    handleImageEditorClose,
    handleSave,
  } = useProfileEditor();

  const displayNickname = profile.nickname.trim() || '익명 사용자';

  if (isLoading) {
    return (
      <section className="mx-auto flex w-full max-w-4xl items-center justify-center rounded-[32px] bg-white px-6 py-16 text-slate-500 shadow-sm sm:px-8 md:px-10">
        프로필을 불러오는 중...
      </section>
    );
  }

  if (isError) {
    return (
      <section className="mx-auto w-full max-w-4xl rounded-[32px] bg-white px-6 py-16 text-center shadow-sm sm:px-8 md:px-10">
        <p className="text-base text-rose-500">
          프로필을 불러오지 못했어요.
          {error instanceof Error ? ` ${error.message}` : ''}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-5 h-11 rounded-2xl bg-slate-900 px-5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          다시 시도
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-4xl rounded-[32px] bg-white px-6 py-8 shadow-sm sm:px-8 md:px-10 md:py-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="flex flex-col items-center gap-3 sm:items-start">
          <ProfileAvatar
            nickname={displayNickname}
            profileImageUrl={profile.profileImageUrl}
            imageError={imageError}
            onError={() => setImageError(true)}
            onClick={handleImageEditorToggle}
          />
          <span className="text-xs font-medium text-slate-400">이미지를 클릭해 URL 변경</span>
          <ProfileImageEditor
            isOpen={isImageEditorOpen}
            imageInputValue={imageInputValue}
            imageError={imageError}
            onImageInputChange={setImageInputValue}
            onApply={handleImageApply}
            onClose={handleImageEditorClose}
          />
        </div>

        <div className="flex flex-1 flex-col justify-center text-center sm:text-left">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{displayNickname}</h1>
            <div className="flex justify-center sm:justify-end">
              <span className="inline-flex min-h-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-600">
                {profile.mbti || 'MBTI'}
              </span>
            </div>
          </div>
          <p className="mt-2 text-lg text-slate-400">{profile.introduce}</p>
          <p className="mt-2 text-sm text-slate-500">저장용 이름 {profile.name.trim() || '미입력'}</p>
        </div>
      </div>

      <div className="mt-10 space-y-7">
        <label className="block">
          <span className="mb-3 block text-[18px] font-medium text-slate-800">닉네임</span>
          <input
            type="text"
            value={profile.nickname}
            onChange={(event) => handleFieldChange('nickname', event.target.value)}
            placeholder="닉네임을 입력하세요"
            className="h-16 w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 text-lg text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-200 focus:bg-white"
          />
        </label>
        <label className="block">
          <span className="mb-3 block text-[18px] font-medium text-slate-800">이름</span>
          <input
            type="text"
            value={profile.name}
            onChange={(event) => handleFieldChange('name', event.target.value)}
            placeholder="이름을 입력하세요"
            className="h-16 w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 text-lg text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-200 focus:bg-white"
          />
        </label>
        <label className="block">
          <span className="mb-3 block text-[18px] font-medium text-slate-800">한줄소개</span>
          <textarea
            value={profile.introduce}
            onChange={(event) => handleFieldChange('introduce', event.target.value)}
            placeholder="소개를 입력하세요"
            rows={4}
            className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-5 text-lg text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-200 focus:bg-white"
          />
        </label>
        <div className="block">
          <span className="mb-3 block text-[18px] font-medium text-slate-800">MBTI</span>
          <div className="grid grid-cols-5 gap-3">
            {MBTI_OPTIONS.map((mbti) => {
              const isSelected = profile.mbti === mbti;
              return (
                <button
                  key={mbti}
                  type="button"
                  onClick={() => handleFieldChange('mbti', mbti)}
                  aria-pressed={isSelected}
                  className={`h-12 rounded-2xl border text-sm font-semibold transition ${isSelected ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-100 bg-slate-50 text-slate-700 hover:border-indigo-200 hover:bg-white'}`}
                >
                  {mbti}
                </button>
              );
            })}
          </div>
        </div>
        <ProfileSaveButton
          isPending={isSavePending}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
          onSave={handleSave}
        />
      </div>
    </section>
  );
};

export default ProfileEditorSection;
