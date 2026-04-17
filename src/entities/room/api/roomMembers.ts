import client from '@/shared/api/client';
import type { GetRoomMembersResponse } from '../model/types';

export async function getRoomMembers(roomId: number): Promise<GetRoomMembersResponse> {
  const response = await client.get<GetRoomMembersResponse>(`/api/v1/rooms/${roomId}/members`);

  return response.data;
}
