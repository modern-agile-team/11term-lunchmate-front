import type { RoomDetailResponse, RoomListFilters, RoomListItemResponse } from '@/shared/api/rooms/rooms';
import type { MainRoom } from './types';
import { detailRoomStatusStyleMap, type RoomFilterState } from './roomTab.constants';

export const toMainRoomType = (roomType: RoomListItemResponse['roomType']): MainRoom['roomType'] => {
  if (roomType === 'MALE' || roomType === 'FEMALE') {
    return roomType;
  }

  return 'MIXED';
};

export const formatLunchAt = (lunchAt: string): string => {
  const timeMatch = lunchAt.match(/(?:T|\s)?(\d{2}:\d{2})/);

  if (timeMatch) {
    return timeMatch[1];
  }

  return lunchAt;
};

export const toMainRoom = (room: RoomListItemResponse): MainRoom => ({
  id: room.id,
  title: room.title,
  roomType: toMainRoomType(room.roomType),
  minAge: room.minAge,
  maxAge: room.maxAge,
  currentCount: room.currentCount,
  capacity: room.maxMembersCount,
  place: room.place,
  lunchAt: formatLunchAt(room.lunchAt),
});

export const toDetailRoomType = (roomType: RoomDetailResponse['roomType']): MainRoom['roomType'] => {
  if (roomType === 'MALE' || roomType === 'FEMALE') {
    return roomType;
  }

  return 'MIXED';
};

export const toDetailRoomStatus = (
  status: RoomDetailResponse['status'],
): keyof typeof detailRoomStatusStyleMap => {
  if (status === 'OPEN' || status === 'FULL' || status === 'CLOSE') {
    return status;
  }

  return 'OPEN';
};

export const parseAgeFilter = (value: string): number | undefined => {
  if (value.trim() === '') {
    return undefined;
  }

  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) {
    return undefined;
  }

  return parsedValue;
};

export const toRoomListFilters = (roomFilterState: RoomFilterState): RoomListFilters => ({
  roomType: roomFilterState.roomType === 'ALL' ? undefined : roomFilterState.roomType,
  status: roomFilterState.status === 'ALL' ? undefined : roomFilterState.status,
  minAge: parseAgeFilter(roomFilterState.minAge),
  maxAge: parseAgeFilter(roomFilterState.maxAge),
});
