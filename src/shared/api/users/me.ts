import type { GetMeResponse } from '@/shared/types/user';
import client from '@/shared/api/client';

export async function getMe(): Promise<GetMeResponse> {
  const response = await client.get<GetMeResponse>('/api/v1/users/me');

  return response.data;
}
