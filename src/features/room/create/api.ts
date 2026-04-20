import client from '@/shared/api/client';
import type { CreateRoomRequest, RoomDetailResponse } from '@/entities/room';

export async function createRoom(payload: CreateRoomRequest): Promise<RoomDetailResponse> {
  const response = await client.post<RoomDetailResponse>('/api/v1/rooms', payload);

  return response.data;
}
