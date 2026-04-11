import client from '@/shared/api/client';

export interface GetMyUserResponse {
  id: number;
}

export async function getMyUser(): Promise<GetMyUserResponse> {
  const response = await client.get<GetMyUserResponse>('/api/v1/users/me');

  return response.data;
}
