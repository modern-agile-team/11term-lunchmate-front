import client from '@/shared/api/client';
import type { GetMyUserResponse } from '../model/types';

export async function getMyUser(): Promise<GetMyUserResponse> {
  const response = await client.get<GetMyUserResponse>('/api/v1/users/me');

  return response.data;
}
