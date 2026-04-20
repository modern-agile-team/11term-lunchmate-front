import client from '@/shared/api/client';

export async function deleteRoom(roomId: number): Promise<void> {
  await client.delete(`/api/v1/rooms/${roomId}`);
}
