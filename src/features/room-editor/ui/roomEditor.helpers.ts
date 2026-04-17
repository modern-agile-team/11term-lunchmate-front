import type { RoomDetailResponse } from '@/entities/room';

export function formatLunchAtForForm(lunchAt: string) {
  const timeMatch = lunchAt.match(/(?:T|\s)?(\d{2}:\d{2})/);

  if (timeMatch) {
    return timeMatch[1];
  }

  return '12:00';
}

export interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'create' | 'edit';
  roomId?: number;
  initialValues?: CreateRoomFormState;
  onSuccess?: () => void;
  onError?: (message: string) => void;
  onRequireLogin?: () => void;
}

export interface CreateRoomFormState {
  title: string;
  description: string;
  roomType: 'MIXED' | 'FEMALE' | 'MALE';
  capacity: string;
  place: string;
  lunchAt: string;
  minAge: string;
  maxAge: string;
}

export const INITIAL_CREATE_ROOM_FORM_STATE: CreateRoomFormState = {
  title: '',
  description: '',
  roomType: 'MIXED',
  capacity: '4',
  place: '',
  lunchAt: '12:00',
  minAge: '20',
  maxAge: '24',
};

export const toCreateRoomFormState = (room: RoomDetailResponse): CreateRoomFormState => ({
  title: room.title,
  description: room.description ?? '',
  roomType: room.roomType === 'MALE' || room.roomType === 'FEMALE' ? room.roomType : 'MIXED',
  capacity: String(room.maxMembersCount),
  place: room.place,
  lunchAt: formatLunchAtForForm(room.lunchAt),
  minAge: String(room.minAge),
  maxAge: String(room.maxAge),
});
