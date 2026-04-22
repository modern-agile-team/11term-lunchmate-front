import type { RoomEditorFormValues, RoomEditorSource } from './roomEditor.types';

export function formatLunchAtForForm(lunchAt: string) {
  const timeMatch = lunchAt.match(/(?:T|\s)?(\d{2}:\d{2})/);

  if (timeMatch) {
    return timeMatch[1];
  }

  return '12:00';
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
