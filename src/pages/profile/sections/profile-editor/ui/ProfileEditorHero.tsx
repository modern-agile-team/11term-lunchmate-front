import { ProfileAvatar } from '@/entities/user';
import { ProfileImageEditor } from '@/features/profile/update';
import type { UserProfile } from '@/entities/user';

interface ProfileEditorHeroProps {
  profile: UserProfile;
  displayNickname: string;
  imageInputValue: string;
  isImageEditorOpen: boolean;
  imageError: boolean;
  setImageInputValue: (value: string) => void;
  setImageError: (value: boolean) => void;
  onImageApply: () => void;
  onImageEditorToggle: () => void;
  onImageEditorClose: () => void;
}

const ProfileEditorHero = ({
  profile,
  displayNickname,
  imageInputValue,
  isImageEditorOpen,
  imageError,
  setImageInputValue,
  setImageError,
  onImageApply,
  onImageEditorToggle,
  onImageEditorClose,
}: ProfileEditorHeroProps) => (
  <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
    <div className="flex flex-col items-center gap-3 sm:items-start">
      <ProfileAvatar
        nickname={displayNickname}
        profileImageUrl={profile.profileImageUrl}
        imageError={imageError}
        onError={() => setImageError(true)}
        onClick={onImageEditorToggle}
      />
      <span className="text-xs font-medium text-slate-400">이미지를 클릭해 URL 변경</span>
      <ProfileImageEditor
        isOpen={isImageEditorOpen}
        imageInputValue={imageInputValue}
        imageError={imageError}
        onImageInputChange={setImageInputValue}
        onApply={onImageApply}
        onClose={onImageEditorClose}
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
);

export default ProfileEditorHero;
