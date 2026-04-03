import axios from 'axios';
import type {
  GetMyProfileResponse,
  UpdateMyProfileRequest,
  UpdateMyProfileResponse,
} from '@/shared/types/profile';

export async function getMyProfile(): Promise<GetMyProfileResponse> {
  const response = await axios.get<GetMyProfileResponse>('/api/v1/users/me/profile');

  return response.data;
}

export async function updateMyProfile(
  payload: UpdateMyProfileRequest,
): Promise<UpdateMyProfileResponse> {
  const response = await axios.patch<UpdateMyProfileResponse>(
    '/api/v1/users/me/profile',
    payload,
  );

  return response.data;
}
