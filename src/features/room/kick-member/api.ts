import client from '@/shared/api/client';
import type { KickRoomMemberRequest } from '@/entities/room';

export async function kickRoomMember({ roomId, userId }: KickRoomMemberRequest): Promise<void> {
  await client.delete(`/api/v1/rooms/${roomId}/members/${userId}`);
}
