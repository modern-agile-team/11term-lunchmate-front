export const MBTI_OPTIONS = [
  'INTJ',
  'INTP',
  'ENTJ',
  'ENTP',
  'INFJ',
  'INFP',
  'ENFJ',
  'ENFP',
  'ISTJ',
  'ISFJ',
  'ESTJ',
  'ESFJ',
  'ISTP',
  'ISFP',
  'ESTP',
  'ESFP',
] as const;

export type MbtiType = (typeof MBTI_OPTIONS)[number];

export type Gender = 'MALE' | 'FEMALE';

export interface UserProfile {
  nickname: string;
  introduce: string;
  mbti: MbtiType | '';
  gender: Gender | '';
  profileImageUrl: string;
}

export interface GetMyProfileResponse {
  nickname: string;
  introduce: string;
  mbti: MbtiType;
  gender: Gender;
  profileImageUrl: string;
}

export interface UpdateMyProfileRequest {
  nickname: string;
  introduce: string;
  mbti: MbtiType;
  gender: Gender;
  profileImageUrl: string;
}

export interface UpdateMyProfileResponse {
  nickname: string;
  introduce: string;
  mbti: MbtiType;
  gender: Gender;
  profileImageUrl: string;
}
