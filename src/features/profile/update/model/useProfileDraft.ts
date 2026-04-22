import { useState } from 'react';
import type { UserProfile } from '@/entities/user';
import { EMPTY_PROFILE, normalizeProfile } from './normalizeProfile';

interface UseProfileDraftParams {
  profileData: UserProfile | undefined;
}

export const useProfileDraft = ({ profileData }: UseProfileDraftParams) => {
  const [profileDraft, setProfileDraft] = useState<UserProfile | null>(null);
  const profile = profileDraft ?? normalizeProfile(profileData) ?? EMPTY_PROFILE;

  const handleFieldChange = <K extends keyof UserProfile>(field: K, value: UserProfile[K]) => {
    setProfileDraft((current) => ({ ...profile, ...current, [field]: value }));
  };

  return {
    profile,
    profileDraft,
    setProfileDraft,
    handleFieldChange,
  };
};
