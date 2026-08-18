import { formatKSTDate, formatKSTTime } from '@/shared/lib/date/formatKST';
import type { RoomEditorFormValues, RoomEditorSource } from './roomEditor.types';

export const toRoomEditorFormValues = (room: RoomEditorSource): RoomEditorFormValues => ({
  title: room.title,
  description: room.description ?? '',
  roomType: room.roomType === 'MALE' || room.roomType === 'FEMALE' ? room.roomType : 'MIXED',
  capacity: String(room.maxMembersCount),
  place: room.place,
  lunchDate: formatKSTDate(room.lunchAt),
  lunchTime: formatKSTTime(room.lunchAt),
  minAge: String(room.minAge),
  maxAge: String(room.maxAge),
});
