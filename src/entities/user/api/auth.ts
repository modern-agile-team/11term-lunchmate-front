import client from '@/shared/api/client';
import type {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  SignUpRequest,
  SignUpResponse,
  SocialProvider,
  SocialRegisterRequest,
  SocialRegisterResponse,
} from '../model/types';

export function getSocialLoginUrl(provider: SocialProvider): string {
  const apiUrl = import.meta.env.VITE_API_URL ?? '';

  return `${apiUrl}/api/v1/auth/${provider}`;
}

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const response = await client.post<LoginResponse>('/api/v1/auth/login', payload);

  return response.data;
}

export async function logout(): Promise<LogoutResponse> {
  const response = await client.post<LogoutResponse>('/api/v1/auth/logout');

  return response.data;
}

export async function signup(payload: SignUpRequest): Promise<SignUpResponse> {
  const response = await client.post<SignUpResponse>('/api/v1/auth/signup', payload);

  return response.data;
}

export async function registerSocial(
  payload: SocialRegisterRequest,
): Promise<SocialRegisterResponse> {
  const response = await client.post<SocialRegisterResponse>(
    '/api/v1/auth/register/social',
    payload,
  );

  return response.data;
}
