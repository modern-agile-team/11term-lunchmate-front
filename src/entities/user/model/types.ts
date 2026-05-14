import type { MbtiType } from './profile';

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

export type GetMyUserResponse = User;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LogoutResponse {
  message: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface UpdateMyUserRequest {
  name: string;
  email: string;
  birthDate: string;
  gender: Gender;
}

export type UpdateMyUserResponse = User;

export interface DeleteMyUserResponse {
  message: string;
}
