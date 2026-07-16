import { MBTI_OPTIONS, type Gender, type MbtiType, type UserProfile } from '@/entities/user';

const GENDER_VALUES: Gender[] = ['MALE', 'FEMALE'];

export const EMPTY_PROFILE: UserProfile = {
  nickname: '',
  introduce: '',
  mbti: '',
  gender: '',
  profileImageUrl: '',
};

export const isMbtiType = (value: unknown): value is MbtiType =>
  typeof value === 'string' && MBTI_OPTIONS.includes(value as MbtiType);

export const isGenderType = (value: unknown): value is Gender =>
  typeof value === 'string' && GENDER_VALUES.includes(value as Gender);

export const normalizeProfile = (
  profile: Partial<UserProfile> | null | undefined,
): UserProfile => ({
  nickname: typeof profile?.nickname === 'string' ? profile.nickname : '',
  introduce: typeof profile?.introduce === 'string' ? profile.introduce : '',
  mbti: isMbtiType(profile?.mbti) ? profile.mbti : '',
  gender: isGenderType(profile?.gender) ? profile.gender : '',
  profileImageUrl: typeof profile?.profileImageUrl === 'string' ? profile.profileImageUrl : '',
});
