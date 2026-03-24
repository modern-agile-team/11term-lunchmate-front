import apiClient from '@/shared/api/client';

import type { Room, RoomListParams, RoomListResponse } from '../model/types';

interface RoomListItemApiResponse {
  id: number | string;
  title?: string;
  roomType?: Room['roomType'];
  minAge?: number;
  maxAge?: number;
  currentCount?: number;
  currentParticipants?: number;
  participantCount?: number;
  capacity?: number;
  place?: string;
  lunchAt?: string;
  lunchTime?: string;
}

interface RoomListApiResponse {
  items?: RoomListItemApiResponse[];
  nextCursor?: number | null;
}

const DEFAULT_ROOM_LIST_SIZE = 10;

const getRoomListItemCurrentCount = (roomListItemApiResponse: RoomListItemApiResponse) => {
  return (
    roomListItemApiResponse.currentCount ??
    roomListItemApiResponse.currentParticipants ??
    roomListItemApiResponse.participantCount ??
    0
  );
};

const mapRoomListItem = (roomListItemApiResponse: RoomListItemApiResponse): Room => {
  return {
    id: Number(roomListItemApiResponse.id),
    title: roomListItemApiResponse.title ?? '제목 없음',
    roomType: roomListItemApiResponse.roomType ?? 'MIXED',
    minAge: roomListItemApiResponse.minAge ?? 0,
    maxAge: roomListItemApiResponse.maxAge ?? 0,
    currentCount: getRoomListItemCurrentCount(roomListItemApiResponse),
    capacity: roomListItemApiResponse.capacity ?? 0,
    place: roomListItemApiResponse.place ?? '장소 미정',
    lunchAt: roomListItemApiResponse.lunchAt ?? roomListItemApiResponse.lunchTime ?? '시간 미정',
  };
};

export const getRoomList = async (roomListParams?: RoomListParams): Promise<RoomListResponse> => {
  const requestRoomListParams = {
    size: DEFAULT_ROOM_LIST_SIZE,
    ...roomListParams,
  };

  const { data } = await apiClient.get<RoomListApiResponse>('/api/v1/rooms', {
    params: requestRoomListParams,
  });

  return {
    items: (data.items ?? []).map(mapRoomListItem),
    nextCursor: data.nextCursor ?? null,
  };
};
