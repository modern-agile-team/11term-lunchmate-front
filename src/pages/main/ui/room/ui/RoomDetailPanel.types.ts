import type { RoomDetailResponse } from '@/entities/room';
import type {
  detailRoomStatusStyleMap,
  detailRoomTypeStyleMap,
} from '../model/constants';

export interface RoomMember {
  userId: number;
  nickname: string;
}

export interface RoomMembersQueryState {
  isLoading: boolean;
  isError: boolean;
}

export interface RoomDetailQueryState {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  data?: RoomDetailResponse;
}

export interface RoomDetailDisplay {
  detailType: keyof typeof detailRoomTypeStyleMap;
  detailStatus: keyof typeof detailRoomStatusStyleMap;
  formattedLunchAt: string;
  currentCount: number;
}

export interface RoomDetailPanelProps {
  detailState: {
    roomDetailQuery: RoomDetailQueryState;
    isHostUser: boolean;
  };
  memberState: {
    roomMembersQuery: RoomMembersQueryState;
    roomMembers: RoomMember[];
    currentUserId: number | null;
  };
  actions: {
    openEditModal: () => void;
    deleteRoom: () => Promise<void>;
    kickMember: (userId: number) => Promise<void>;
  };
  detailDisplay: RoomDetailDisplay | null;
}
