import { useState } from 'react';
import type { UserProfile } from '@/entities/user';

interface UseProfileImageEditorParams {
  profile: UserProfile;
  setProfileDraft: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

export const useProfileImageEditor = ({
  profile,
  setProfileDraft,
}: UseProfileImageEditorParams) => {
  const [imageInputValue, setImageInputValue] = useState('');
  const [isImageEditorOpen, setIsImageEditorOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageApply = () => {
    const nextImageUrl = imageInputValue.trim();
    setImageError(false);
    setProfileDraft((current) => ({ ...profile, ...current, profileImageUrl: nextImageUrl }));
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

  const handleImageEditorClose = () => {
    setImageInputValue(profile.profileImageUrl);
    setIsImageEditorOpen(false);
  };

  return {
    imageInputValue,
    setImageInputValue,
    isImageEditorOpen,
    imageError,
    setImageError,
    handleImageApply,
    handleImageEditorToggle,
    handleImageEditorClose,
  };
};
