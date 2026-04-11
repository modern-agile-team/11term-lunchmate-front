import client from '../client';

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

export interface RoomListFilters {
  roomType?: 'ANY' | 'MALE' | 'FEMALE';
  status?: 'OPEN' | 'FULL' | 'CLOSE';
  minAge?: number;
  maxAge?: number;
}

export async function getRooms(filters: RoomListFilters = {}): Promise<GetRoomsResponse> {
  const response = await client.get<GetRoomsResponse>('/api/v1/rooms', {
    params: {
      roomType: filters.roomType,
      status: filters.status,
      minAge: filters.minAge,
      maxAge: filters.maxAge,
    },
  });

  return response.data;
}
