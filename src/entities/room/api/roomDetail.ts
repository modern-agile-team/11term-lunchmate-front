import client from '@/shared/api/client';
import type { RoomDetailResponse } from '../model/types';

export async function getRoomDetail(roomId: number): Promise<RoomDetailResponse> {
  const response = await client.get<RoomDetailResponse>(`/api/v1/rooms/${roomId}`);

  return response.data;
}
