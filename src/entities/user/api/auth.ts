import client from '@/shared/api/client';
import type {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  SignUpRequest,
  SignUpResponse,
} from '../model/types';

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const response = await client.post<LoginResponse>('/auth/login', payload);

  return response.data;
}

export async function logout(): Promise<LogoutResponse> {
  const response = await client.post<LogoutResponse>('/auth/logout');

  return response.data;
}

export async function signup(payload: SignUpRequest): Promise<SignUpResponse> {
  const response = await client.post<SignUpResponse>('/auth/signup', payload);

  return response.data;
}
