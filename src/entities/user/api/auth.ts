import client from '@/shared/api/client';
import type { LoginRequest, LoginResponse, LogoutResponse } from '../model/types';

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const response = await client.post<LoginResponse>('/api/v1/auth/login', payload);

  return response.data;
}

export async function logout(): Promise<LogoutResponse> {
  const response = await client.post<LogoutResponse>('/api/v1/auth/logout');

  return response.data;
}
