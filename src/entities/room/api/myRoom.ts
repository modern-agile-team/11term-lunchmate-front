import client from '@/shared/api/client';
import type { RoomDetailResponse } from '../model/types';

export async function getMyRoom(): Promise<RoomDetailResponse> {
  const response = await client.get<RoomDetailResponse>('/api/v1/rooms/me');

  return response.data;
}
