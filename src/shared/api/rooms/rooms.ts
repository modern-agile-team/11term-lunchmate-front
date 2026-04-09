import client from '@/shared/api/client';

export interface RoomListItemResponse {
  id: number;
  title: string;
  roomType: 'MALE' | 'FEMALE' | 'ANY' | string;
  maxMembersCount: number;
  minAge: number;
  maxAge: number;
  place: string;
  lunchAt: string;
  currentCount: number;
}

export interface GetRoomsResponse {
  items: RoomListItemResponse[];
}

export async function getRooms(): Promise<GetRoomsResponse> {
  const response = await client.get<GetRoomsResponse>('/api/v1/rooms');

  return response.data;
}
