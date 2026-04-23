import type { MbtiType } from './profile';

export interface GetMyUserResponse {
  id: number;
}

export type Gender = 'MALE' | 'FEMALE' | 'ANY';

export interface User {
  id: number;
  name: string;
  email: string;
  profileImageUrl: string;
  mbti: MbtiType | '';
  introduce: string;
  nickname: string;
  birthDate: string;
  gender: Gender;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
