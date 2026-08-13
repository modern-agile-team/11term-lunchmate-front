import client from '@/shared/api/client';
import type { RoomDetailResponse } from '@/entities/room';

export async function completeRoom(roomId: number): Promise<RoomDetailResponse> {
  const response = await client.patch<RoomDetailResponse>(`/api/v1/rooms/${roomId}/complete`);

  return response.data;
}
