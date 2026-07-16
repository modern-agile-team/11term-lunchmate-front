import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  myProfileQueryOptions,
  updateMyProfile,
  type Gender,
  type MbtiType,
  type UserProfile,
} from '@/entities/user';
import { normalizeProfile } from './normalizeProfile';

interface UseProfileSaveParams {
  profile: UserProfile;
  setProfileDraft: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  setImageError: (value: boolean) => void;
  onSaveSuccess?: () => void;
}

export const useProfileSave = ({
  profile,
  setProfileDraft,
  setImageError,
  onSaveSuccess,
}: UseProfileSaveParams) => {
  const queryClient = useQueryClient();
  const [saveMessage, setSaveMessage] = useState('');
  const [saveMessageTone, setSaveMessageTone] = useState<'success' | 'error'>('success');

  const updateProfileMutation = useMutation({
    mutationFn: updateMyProfile,
    onSuccess: (updatedProfile) => {
      const normalizedUpdatedProfile = normalizeProfile(updatedProfile);
      setProfileDraft(normalizedUpdatedProfile);
      setImageError(false);
      setSaveMessage('프로필이 저장되었어요.');
      setSaveMessageTone('success');
      queryClient.invalidateQueries({ queryKey: myProfileQueryOptions().queryKey });
      onSaveSuccess?.();
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

    if (!profile.gender) {
      setSaveMessage('성별을 선택한 뒤 저장해 주세요.');
      setSaveMessageTone('error');
      return;
    }

    clearSaveMessage();
    updateProfileMutation.mutate({
      nickname: profile.nickname.trim(),
      introduce: profile.introduce.trim(),
      mbti: profile.mbti as MbtiType,
      gender: profile.gender as Gender,
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
