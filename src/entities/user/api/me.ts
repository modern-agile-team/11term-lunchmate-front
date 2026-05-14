import client from '@/shared/api/client';
import type {
  DeleteMyUserResponse,
  GetMyUserResponse,
  UpdateMyUserRequest,
  UpdateMyUserResponse,
} from '../model/types';

export async function getMyUser(): Promise<GetMyUserResponse> {
  const response = await client.get<GetMyUserResponse>('/api/v1/users/me');

  return response.data;
}

export async function updateMyUser(payload: UpdateMyUserRequest): Promise<UpdateMyUserResponse> {
  const response = await client.patch<UpdateMyUserResponse>('/api/v1/users/me', payload);

  return response.data;
}

export async function deleteMyUser(): Promise<DeleteMyUserResponse> {
  const response = await client.delete<DeleteMyUserResponse>('/api/v1/users/me');

  return response.data;
}
