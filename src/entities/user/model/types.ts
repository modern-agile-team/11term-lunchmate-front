import type { Gender, MbtiType } from './profile';

export type Role = 'ADMIN' | 'USER';

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
  role: Role;
  createdAt: string;
}

export type GetMyUserResponse = User;

export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
  nickname: string;
  birthDate: string;
  gender: Gender;
  schoolInfo?: string;
  introduce?: string;
  mbti?: string;
}

export interface SignUpResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

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
}

export type UpdateMyUserResponse = User;

export interface DeleteMyUserResponse {
  message: string;
}
