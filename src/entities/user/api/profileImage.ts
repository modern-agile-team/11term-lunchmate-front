import client from '@/shared/api/client';

export interface UploadMyProfileImageResponse {
  imageURL: string;
}

export async function uploadMyProfileImage(file: File): Promise<UploadMyProfileImageResponse> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await client.post<UploadMyProfileImageResponse>(
    '/api/v1/users/me/profile-image',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );

  return response.data;
}
