import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  myProfileQueryOptions,
  updateMyProfile,
  type MbtiType,
  type UserProfile,
} from '@/entities/user';
import { normalizeProfile } from './normalizeProfile';

interface UseProfileSaveParams {
  profile: UserProfile;
  setProfileDraft: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  setImageInputValue: (value: string) => void;
  setImageError: (value: boolean) => void;
}

export const useProfileSave = ({
  profile,
  setProfileDraft,
  setImageInputValue,
  setImageError,
}: UseProfileSaveParams) => {
  const queryClient = useQueryClient();
  const [saveMessage, setSaveMessage] = useState('');
  const [saveMessageTone, setSaveMessageTone] = useState<'success' | 'error'>('success');

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

  const clearSaveMessage = () => {
    setSaveMessage('');
  };

  const handleSave = () => {
    if (!profile.mbti) {
      setSaveMessage('MBTI를 선택한 뒤 저장해 주세요.');
      setSaveMessageTone('error');
      return;
    }

    clearSaveMessage();
    updateProfileMutation.mutate({
      name: profile.name.trim(),
      nickname: profile.nickname.trim(),
      introduce: profile.introduce.trim(),
      mbti: profile.mbti as MbtiType,
      profileImageUrl: profile.profileImageUrl.trim(),
    });
  };

  return {
    saveMessage,
    saveMessageTone,
    isSavePending: updateProfileMutation.isPending,
    clearSaveMessage,
    handleSave,
  };
};
