import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  myProfileQueryOptions,
  updateMyProfile,
  type MbtiType,
  type UserProfile,
} from '@/entities/user';
import { EMPTY_PROFILE, normalizeProfile } from './normalizeProfile';

export const useProfileEditor = () => {
  const queryClient = useQueryClient();
  const [profileDraft, setProfileDraft] = useState<UserProfile | null>(null);
  const [imageInputValue, setImageInputValue] = useState('');
  const [isImageEditorOpen, setIsImageEditorOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveMessageTone, setSaveMessageTone] = useState<'success' | 'error'>('success');

  const profileQuery = useQuery(myProfileQueryOptions());

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

  const profile = profileDraft ?? normalizeProfile(profileQuery.data) ?? EMPTY_PROFILE;

  const handleFieldChange = <K extends keyof UserProfile>(field: K, value: UserProfile[K]) => {
    setProfileDraft((current) => ({ ...profile, ...current, [field]: value }));
  };

  const handleImageApply = () => {
    const nextImageUrl = imageInputValue.trim();
    setImageError(false);
    setProfileDraft((current) => ({ ...profile, ...current, profileImageUrl: nextImageUrl }));
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

  const handleImageEditorClose = () => {
    setImageInputValue(profile.profileImageUrl);
    setIsImageEditorOpen(false);
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
      introduce: profile.introduce.trim(),
      mbti: profile.mbti as MbtiType,
      profileImageUrl: profile.profileImageUrl.trim(),
    });
  };

  return {
    profile,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    error: profileQuery.error,
    refetch: profileQuery.refetch,
    imageInputValue,
    isImageEditorOpen,
    imageError,
    saveMessage,
    saveMessageTone,
    isSavePending: updateProfileMutation.isPending,
    setImageInputValue,
    setImageError,
    handleFieldChange,
    handleImageApply,
    handleImageEditorToggle,
    handleImageEditorClose,
    handleSave,
  };
};
