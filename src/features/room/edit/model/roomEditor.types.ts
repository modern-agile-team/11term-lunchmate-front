import type { RoomDetailResponse } from '@/entities/room';

export interface RoomEditorFormValues {
  title: string;
  description: string;
  roomType: 'MIXED' | 'FEMALE' | 'MALE';
  capacity: string;
  place: string;
  lunchAt: string;
  minAge: string;
  maxAge: string;
}

export interface RoomEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'create' | 'edit';
  roomId?: number;
  initialValues?: RoomEditorFormValues;
  onSuccess?: () => void;
  onError?: (message: string) => void;
  onRequireLogin?: () => void;
}

export const INITIAL_ROOM_EDITOR_FORM_VALUES: RoomEditorFormValues = {
  title: '',
  description: '',
  roomType: 'MIXED',
  capacity: '4',
  place: '',
  lunchAt: '12:00',
  minAge: '20',
  maxAge: '24',
};

export type RoomEditorSource = RoomDetailResponse;
