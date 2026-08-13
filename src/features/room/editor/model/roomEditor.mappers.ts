import { formatKSTTime } from '@/shared/lib/date/formatKST';
import type { RoomEditorFormValues, RoomEditorSource } from './roomEditor.types';

export function formatLunchAtForForm(lunchAt: string) {
  return formatKSTTime(lunchAt);
}

export const toRoomEditorFormValues = (room: RoomEditorSource): RoomEditorFormValues => ({
  title: room.title,
  description: room.description ?? '',
  roomType: room.roomType === 'MALE' || room.roomType === 'FEMALE' ? room.roomType : 'MIXED',
  capacity: String(room.maxMembersCount),
  place: room.place,
  lunchAt: formatLunchAtForForm(room.lunchAt),
  minAge: String(room.minAge),
  maxAge: String(room.maxAge),
});
