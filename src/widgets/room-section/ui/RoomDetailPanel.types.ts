import type { MainRoom, RoomDetailResponse, RoomDetailStatus } from '@/entities/room';

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
  detailType: MainRoom['roomType'];
  detailStatus: RoomDetailStatus;
  formattedLunchAt: string;
  currentCount: number;
}

export interface RoomDetailPanelProps {
  roomDetailQuery: RoomDetailQueryState;
  roomMembersQuery: RoomMembersQueryState;
  roomMembers: RoomMember[];
  currentUserId: number | null;
  isHostUser: boolean;
  detailDisplay: RoomDetailDisplay | null;
  onEdit: () => void;
  onDelete: () => Promise<void>;
  onKickMember: (userId: number) => Promise<void>;
}
