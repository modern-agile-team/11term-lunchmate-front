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

export interface UserProfile {
  name: string;
  nickname: string;
  introduce: string;
  mbti: MbtiType | '';
  profileImageUrl: string;
}

export interface GetMyProfileResponse {
  name: string;
  nickname: string;
  introduce: string;
  mbti: MbtiType;
  profileImageUrl: string;
}

export interface UpdateMyProfileRequest {
  name: string;
  nickname: string;
  introduce: string;
  mbti: MbtiType;
  profileImageUrl: string;
}

export interface UpdateMyProfileResponse {
  name: string;
  nickname: string;
  introduce: string;
  mbti: MbtiType;
  profileImageUrl: string;
}
