import client from '@/shared/api/client';
import type {
  CreateRoomRequest,
  RoomDetailResponse,
  RoomJoinResponse,
  UpdateRoomRequest,
} from '@/entities/room';

export async function createRoom(payload: CreateRoomRequest): Promise<RoomDetailResponse> {
  const response = await client.post<RoomDetailResponse>('/api/v1/rooms', payload);

  return response.data;
}

export async function updateRoom(
  roomId: number,
  payload: UpdateRoomRequest,
): Promise<RoomDetailResponse> {
  const response = await client.patch<RoomDetailResponse>(`/api/v1/rooms/${roomId}`, payload);

  return response.data;
}

export async function joinRoom(roomId: number): Promise<RoomJoinResponse> {
  const response = await client.post<RoomJoinResponse>(`/api/v1/rooms/${roomId}/join`);

  return response.data;
}

export async function leaveRoom(roomId: number): Promise<void> {
  await client.post(`/api/v1/rooms/${roomId}/leave`);
}

export async function deleteRoom(roomId: number): Promise<void> {
  await client.delete(`/api/v1/rooms/${roomId}`);
}
