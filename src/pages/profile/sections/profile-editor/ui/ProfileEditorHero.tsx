import type { ChangeEvent, RefObject } from 'react';
import { ProfileAvatar } from '@/entities/user';
import { ProfileImageEditor } from '@/features/profile/update';
import InfoRow from '@/shared/ui/InfoRow';

interface ProfileEditorHeroProps {
  nickname: string;
  profileImageUrl: string | null;
  displayNickname: string;
  imageError: boolean;
  setImageError: (value: boolean) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  isUploadPending: boolean;
  uploadErrorMessage: string;
  onImageButtonClick: () => void;
  onImageFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const ProfileEditorHero = ({
  profileImageUrl,
  displayNickname,
  imageError,
  setImageError,
  fileInputRef,
  isUploadPending,
  uploadErrorMessage,
  onImageButtonClick,
  onImageFileChange,
}: ProfileEditorHeroProps) => (
  <InfoRow label="이미지">
    <div className="flex items-center gap-3 sm:gap-4">
      <ProfileAvatar
        nickname={displayNickname}
        profileImageUrl={profileImageUrl ?? ''}
        imageError={imageError}
        onError={() => setImageError(true)}
        onClick={onImageButtonClick}
      />
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-slate-400">이미지를 클릭해 사진 변경</span>
        <ProfileImageEditor
          fileInputRef={fileInputRef}
          isUploadPending={isUploadPending}
          uploadErrorMessage={uploadErrorMessage}
          onFileChange={onImageFileChange}
        />
      </div>
    </div>
  </InfoRow>
);

export default ProfileEditorHero;
