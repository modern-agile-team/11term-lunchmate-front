import client from '@/shared/api/client';
import type { RoomDetailResponse, UpdateRoomRequest } from '@/entities/room';

export async function updateRoom(
  roomId: number,
  payload: UpdateRoomRequest,
): Promise<RoomDetailResponse> {
  const response = await client.patch<RoomDetailResponse>(`/api/v1/rooms/${roomId}`, payload);

  return response.data;
}
