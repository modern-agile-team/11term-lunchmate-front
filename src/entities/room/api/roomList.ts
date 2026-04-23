import client from '@/shared/api/client';
import type { GetRoomsParams, GetRoomsResponse } from '../model/types';

export async function getRooms(params: GetRoomsParams = {}): Promise<GetRoomsResponse> {
  const response = await client.get<GetRoomsResponse>('/api/v1/rooms', {
    params: {
      roomType: params.roomType,
      status: params.status,
      minAge: params.minAge,
      maxAge: params.maxAge,
      cursor: params.cursor,
      size: params.size,
    },
  });

  return response.data;
}
