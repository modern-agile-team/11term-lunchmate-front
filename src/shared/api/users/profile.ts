import type {
  GetMyProfileResponse,
  UpdateMyProfileRequest,
  UpdateMyProfileResponse,
} from '@/shared/types/profile';
import client from '@/shared/api/client';

export async function getMyProfile(): Promise<GetMyProfileResponse> {
  const response = await client.get<GetMyProfileResponse>('/api/v1/users/me/profile');

  return response.data;
}

export async function updateMyProfile(
  payload: UpdateMyProfileRequest,
): Promise<UpdateMyProfileResponse> {
  const response = await client.patch<UpdateMyProfileResponse>(
    '/api/v1/users/me/profile',
    payload,
  );

  return response.data;
}
