import { MBTI_OPTIONS, type MbtiType, type UserProfile } from '@/entities/user';

export const EMPTY_PROFILE: UserProfile = {
  name: '',
  nickname: '',
  introduce: '',
  mbti: '',
  profileImageUrl: '',
};

export const isMbtiType = (value: unknown): value is MbtiType =>
  typeof value === 'string' && MBTI_OPTIONS.includes(value as MbtiType);

export const normalizeProfile = (
  profile: Partial<UserProfile> | null | undefined,
): UserProfile => ({
  name: typeof profile?.name === 'string' ? profile.name : '',
  nickname: typeof profile?.nickname === 'string' ? profile.nickname : '',
  introduce: typeof profile?.introduce === 'string' ? profile.introduce : '',
  mbti: isMbtiType(profile?.mbti) ? profile.mbti : '',
  profileImageUrl: typeof profile?.profileImageUrl === 'string' ? profile.profileImageUrl : '',
});
