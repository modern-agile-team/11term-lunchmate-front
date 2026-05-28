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
  nextCursor?: string | null;
}

export interface RoomListFilters {
  roomType?: 'ANY' | 'MALE' | 'FEMALE';
  status?: 'OPEN' | 'FULL' | 'CLOSE';
  minAge?: number;
  maxAge?: number;
}

export interface GetRoomsParams extends RoomListFilters {
  cursor?: string;
  size?: number;
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
  mbti: string;
  profileImageUrl: string;
  schoolName: string;
  age: number;
}

export interface GetRoomMembersResponse {
  items: RoomMemberResponse[];
}

export interface KickRoomMemberRequest {
  roomId: number;
  userId: number;
}
