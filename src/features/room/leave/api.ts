import client from '@/shared/api/client';

export async function leaveRoom(roomId: number): Promise<void> {
  await client.delete(`/api/v1/rooms/${roomId}/leave`);
}
