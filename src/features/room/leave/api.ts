import client from '@/shared/api/client';

export async function leaveRoom(roomId: number): Promise<void> {
  await client.post(`/api/v1/rooms/${roomId}/leave`);
}
