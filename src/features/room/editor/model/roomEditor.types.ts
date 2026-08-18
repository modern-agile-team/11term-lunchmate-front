import { getTodayKSTDateString } from '@/shared/lib/date/formatKST';
import type { RoomDetailResponse } from '@/entities/room';

export interface RoomEditorFormValues {
  title: string;
  description: string;
  roomType: 'MIXED' | 'FEMALE' | 'MALE';
  capacity: string;
  place: string;
  lunchDate: string;
  lunchTime: string;
  minAge: string;
  maxAge: string;
}

export interface RoomEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'create' | 'edit';
  roomId?: number;
  initialValues?: RoomEditorFormValues;
  onSuccess?: (room: RoomDetailResponse) => void;
  onError?: (message: string) => void;
  onRequireLogin?: () => void;
}

export const getInitialRoomEditorFormValues = (): RoomEditorFormValues => ({
  title: '',
  description: '',
  roomType: 'MIXED',
  capacity: '4',
  place: '',
  lunchDate: getTodayKSTDateString(),
  lunchTime: '12:00',
  minAge: '20',
  maxAge: '24',
});

export type RoomEditorSource = RoomDetailResponse;
