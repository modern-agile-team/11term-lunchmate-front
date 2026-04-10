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

export interface RoomListFilters {
  roomType?: 'ANY' | 'MALE' | 'FEMALE';
  status?: 'OPEN' | 'FULL' | 'CLOSE';
  minAge?: number;
  maxAge?: number;
}

export interface RoomDetailResponse {
  id: number;
  hostUserId: number;
  title: string;
  roomType: 'MALE' | 'FEMALE' | 'ANY' | string;
  maxMembersCount: number;
  minAge: number;
  maxAge: number;
  place: string;
  lunchAt: string;
  status: 'OPEN' | 'FULL' | 'CLOSE' | string;
  description: string | null;
  currentMembersCount: number;
}

export interface CreateRoomRequest {
  title: string;
  description?: string;
  roomType: 'MALE' | 'FEMALE' | 'ANY';
  maxMembersCount: number;
  place: string;
  lunchAt: string;
  minAge: number;
  maxAge: number;
}

export interface UpdateRoomRequest {
  title?: string;
  description?: string;
  roomType?: 'MALE' | 'FEMALE' | 'ANY';
  maxMembersCount?: number;
  place?: string;
  lunchAt?: string;
  minAge?: number;
  maxAge?: number;
}

export interface RoomJoinResponse {
  roomId: number;
  userId: number;
  createdAt: string;
}

export interface RoomMemberResponse {
  userId: number;
  nickname: string;
}

export interface GetRoomMembersResponse {
  items: RoomMemberResponse[];
}

export interface KickRoomMemberRequest {
  roomId: number;
  userId: number;
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

export async function getRoomDetail(roomId: number): Promise<RoomDetailResponse> {
  const response = await client.get<RoomDetailResponse>(`/api/v1/rooms/${roomId}`);

  return response.data;
}

export async function getRoomMembers(roomId: number): Promise<GetRoomMembersResponse> {
  const response = await client.get<GetRoomMembersResponse>(`/api/v1/rooms/${roomId}/members`);

  return response.data;
}

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

export async function kickRoomMember({ roomId, userId }: KickRoomMemberRequest): Promise<void> {
  await client.delete(`/api/v1/rooms/${roomId}/members/${userId}`);
}
