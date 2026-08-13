import type { Gender } from '@/entities/user';

export interface RoomListItemResponse {
  id: number;
  title: string;
  roomType: 'MALE' | 'FEMALE' | 'ANY' | string;
  maxMembersCount: number;
  minAge: number;
  maxAge: number;
  place: string;
  lunchAt: string;
  currentMembersCount: number;
}

export interface GetRoomsResponse {
  items: RoomListItemResponse[];
  nextCursor?: string | null;
  hasNext: boolean;
}

export interface RoomListFilters {
  roomType?: 'ANY' | 'MALE' | 'FEMALE';
  status?: 'OPEN' | 'FULL' | 'CLOSE';
  minAge?: number;
  maxAge?: number;
}

export interface GetRoomsParams extends RoomListFilters {
  cursor?: string;
  limit?: number;
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
  status: 'OPEN' | 'FULL' | 'CLOSE' | 'COMPLETE' | string;
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
  id: number;
  nickname: string;
  mbti: string;
  profileImageUrl: string;
  schoolInfo: string;
  gender: Gender;
  age: number;
}

export interface GetRoomMembersResponse {
  items: RoomMemberResponse[];
}

export interface KickRoomMemberRequest {
  roomId: number;
  userId: number;
}

export interface RoomSyncRequest {
  roomId: number;
}
