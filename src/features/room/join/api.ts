import client from '@/shared/api/client';
import type { RoomJoinResponse } from '@/entities/room';

export async function joinRoom(roomId: number): Promise<RoomJoinResponse> {
  const response = await client.post<RoomJoinResponse>(`/api/v1/rooms/${roomId}/join`);

  return response.data;
}
