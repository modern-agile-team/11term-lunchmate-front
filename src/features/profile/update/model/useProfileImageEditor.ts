import { useMutation } from '@tanstack/react-query';
import { useRef, useState, type ChangeEvent } from 'react';
import { uploadMyProfileImage, type UserProfile } from '@/entities/user';

interface UseProfileImageEditorParams {
  profile: UserProfile;
  setProfileDraft: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

export const useProfileImageEditor = ({
  profile,
  setProfileDraft,
}: UseProfileImageEditorParams) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: uploadMyProfileImage,
    onSuccess: ({ profileImageUrl }) => {
      setImageError(false);
      setProfileDraft((current) => ({ ...profile, ...current, profileImageUrl }));
    },
  });

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    uploadMutation.mutate(file);
  };

  return {
    fileInputRef,
    imageError,
    setImageError,
    isUploadPending: uploadMutation.isPending,
    uploadErrorMessage: uploadMutation.isError
      ? '이미지 업로드에 실패했어요. 다시 시도해 주세요.'
      : '',
    handleImageButtonClick,
    handleImageFileChange,
  };
};
