import type {
  MainRoom,
  RoomDetailResponse,
  RoomDetailStatus,
  RoomMemberResponse,
} from '@/entities/room';

export type RoomMember = RoomMemberResponse;

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
  joinedRoomId: number | null;
  isJoinPending: boolean;
  onJoin: () => void;
  onEdit: () => void;
  onRequestDelete: () => void;
  onRequestKick: (userId: number, nickname: string) => void;
  onRequestComplete: () => void;
  onRequestLeave: () => void;
}
