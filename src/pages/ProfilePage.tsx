import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import MainHeader from '@/pages/main/ui/MainHeader';
import { updateMyProfile } from '@/shared/api/profile';
import { myProfileQueryOptions } from '@/shared/api/profileQueries';
import { MBTI_OPTIONS, type MbtiType, type UserProfile } from '@/shared/types/profile';

const EMPTY_PROFILE: UserProfile = {
  name: '',
  nickname: '',
  bio: '',
  mbti: '',
  profileImageUrl: '',
};

const isMbtiType = (value: unknown): value is MbtiType =>
  typeof value === 'string' && MBTI_OPTIONS.includes(value as MbtiType);

const normalizeProfile = (profile: Partial<UserProfile> | null | undefined): UserProfile => ({
  name: typeof profile?.name === 'string' ? profile.name : '',
  nickname: typeof profile?.nickname === 'string' ? profile.nickname : '',
  bio: typeof profile?.bio === 'string' ? profile.bio : '',
  mbti: isMbtiType(profile?.mbti) ? profile.mbti : '',
  profileImageUrl: typeof profile?.profileImageUrl === 'string' ? profile.profileImageUrl : '',
});

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const [profileDraft, setProfileDraft] = useState<UserProfile | null>(null);
  const [imageInputValue, setImageInputValue] = useState('');
  const [isImageEditorOpen, setIsImageEditorOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveMessageTone, setSaveMessageTone] = useState<'success' | 'error'>('success');

  const {
    data: profileData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(myProfileQueryOptions());

  const updateProfileMutation = useMutation({
    mutationFn: updateMyProfile,
    onSuccess: (updatedProfile) => {
      const normalizedUpdatedProfile = normalizeProfile(updatedProfile);

      setProfileDraft(normalizedUpdatedProfile);
      setImageInputValue(normalizedUpdatedProfile.profileImageUrl);
      setImageError(false);
      setSaveMessage('프로필이 저장되었어요.');
      setSaveMessageTone('success');
      queryClient.invalidateQueries({ queryKey: myProfileQueryOptions().queryKey });
    },
    onError: () => {
      setSaveMessage('프로필 저장에 실패했어요. 잠시 후 다시 시도해 주세요.');
      setSaveMessageTone('error');
    },
  });

  const profile = profileDraft ?? normalizeProfile(profileData) ?? EMPTY_PROFILE;

  const showProfileImage = Boolean(profile.profileImageUrl) && !imageError;
  const profileInitial = profile.name.trim().charAt(0).toUpperCase() || 'P';

  const handleImageApply = () => {
    const nextImageUrl = imageInputValue.trim();

    setImageError(false);
    setProfileDraft((current) => ({
      ...profile,
      ...current,
      profileImageUrl: nextImageUrl,
    }));
    setSaveMessage('');

    if (!nextImageUrl) {
      setIsImageEditorOpen(false);
    }
  };

  const handleImageEditorToggle = () => {
    setIsImageEditorOpen((current) => {
      const nextOpen = !current;

      if (nextOpen) {
        setImageInputValue(profile.profileImageUrl);
      }

      return nextOpen;
    });
  };

  const handleSave = () => {
    if (!profile.mbti) {
      setSaveMessage('MBTI를 선택한 뒤 저장해 주세요.');
      setSaveMessageTone('error');
      return;
    }

    setSaveMessage('');
    updateProfileMutation.mutate({
      name: profile.name.trim(),
      nickname: profile.nickname.trim(),
      bio: profile.bio.trim(),
      mbti: profile.mbti as MbtiType,
      profileImageUrl: profile.profileImageUrl.trim(),
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <MainHeader />
        <main className="px-6 py-10 md:px-8">
          <section className="mx-auto flex w-full max-w-4xl items-center justify-center rounded-[32px] bg-white px-6 py-16 text-slate-500 shadow-sm sm:px-8 md:px-10">
            프로필을 불러오는 중...
          </section>
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-slate-50">
        <MainHeader />
        <main className="px-6 py-10 md:px-8">
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
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <MainHeader />

      <main className="px-6 py-10 md:px-8">
        <section className="mx-auto w-full max-w-4xl rounded-[32px] bg-white px-6 py-8 shadow-sm sm:px-8 md:px-10 md:py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex flex-col items-center gap-3 sm:items-start">
              <button
                type="button"
                onClick={handleImageEditorToggle}
                aria-label="프로필 이미지 URL 수정"
                className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-sm font-semibold text-slate-500 shadow-sm transition hover:scale-[1.02] hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 sm:h-32 sm:w-32"
              >
                {showProfileImage ? (
                  <img
                    src={profile.profileImageUrl}
                    alt={`${profile.name || '프로필'} profile`}
                    className="h-full w-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-200 via-slate-100 to-white text-slate-600">
                    <span className="text-3xl font-semibold sm:text-4xl">{profileInitial}</span>
                    <span className="mt-1 text-[11px] font-medium uppercase tracking-[0.24em] text-slate-400">
                      Profile
                    </span>
                  </div>
                )}
              </button>

              <span className="text-xs font-medium text-slate-400">이미지를 클릭해 URL 변경</span>

              {isImageEditorOpen ? (
                <div className="w-full max-w-xs space-y-2">
                  <input
                    type="url"
                    value={imageInputValue}
                    onChange={(event) => setImageInputValue(event.target.value)}
                    placeholder="이미지 URL을 입력하세요"
                    className="h-12 w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-200 focus:bg-white"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleImageApply}
                      className="h-11 flex-1 rounded-2xl bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
                    >
                      적용
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImageInputValue(profile.profileImageUrl);
                        setIsImageEditorOpen(false);
                      }}
                      className="h-11 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                    >
                      취소
                    </button>
                  </div>
                  {imageError ? (
                    <p className="text-xs text-rose-500">
                      이미지를 불러오지 못했어요. 다른 URL을 입력하면 다시 시도합니다.
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="flex flex-1 flex-col justify-center text-center sm:text-left">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                  {profile.name}
                </h1>
                <div className="flex justify-center sm:justify-end">
                  <span className="inline-flex min-h-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-600">
                    {profile.mbti || 'MBTI'}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-lg text-slate-400">{profile.bio}</p>
            </div>
          </div>

          <div className="mt-10 space-y-7">
            <label className="block">
              <span className="mb-3 block text-[18px] font-medium text-slate-800">이름</span>
              <input
                type="text"
                value={profile.name}
                onChange={(event) =>
                  setProfileDraft((current) => ({
                    ...profile,
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="이름을 입력하세요"
                className="h-16 w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 text-lg text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-200 focus:bg-white"
              />
            </label>

            <label className="block">
              <span className="mb-3 block text-[18px] font-medium text-slate-800">한줄소개</span>
              <textarea
                value={profile.bio}
                onChange={(event) =>
                  setProfileDraft((current) => ({
                    ...profile,
                    ...current,
                    bio: event.target.value,
                  }))
                }
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
                      onClick={() =>
                        setProfileDraft((current) => ({
                          ...profile,
                          ...current,
                          mbti,
                        }))
                      }
                      aria-pressed={isSelected}
                      className={`h-12 rounded-2xl border text-sm font-semibold transition ${
                        isSelected
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-100 bg-slate-50 text-slate-700 hover:border-indigo-200 hover:bg-white'
                      }`}
                    >
                      {mbti}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleSave}
                disabled={updateProfileMutation.isPending}
                className="h-14 rounded-2xl bg-slate-900 px-6 text-base font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {updateProfileMutation.isPending ? '저장 중...' : '저장'}
              </button>
              {saveMessage ? (
                <p
                  className={`text-sm ${
                    saveMessageTone === 'error' ? 'text-rose-500' : 'text-emerald-600'
                  }`}
                >
                  {saveMessage}
                </p>
              ) : null}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
