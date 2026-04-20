import type { MainRoom } from '@/entities/room';
import { buildRoomCardActionState } from './buildRoomCardActionState';

interface BuildRoomCardActionHandlersParams {
  joinedRoomId: number | null;
  hasJoinedActiveRoom: boolean;
  isJoinPending: boolean;
  pendingJoinRoomId: number | null;
  isLeavePending: boolean;
  pendingLeaveRoomId: number | null;
  handleJoinRoom: (roomId: number) => Promise<void>;
  handleLeaveRoom: (roomId: number) => Promise<void>;
}

export const buildRoomCardActionHandlers = ({
  joinedRoomId,
  hasJoinedActiveRoom,
  isJoinPending,
  pendingJoinRoomId,
  isLeavePending,
  pendingLeaveRoomId,
  handleJoinRoom,
  handleLeaveRoom,
}: BuildRoomCardActionHandlersParams) => ({
  getRoomCardActionState: (room: MainRoom) =>
    buildRoomCardActionState({
      room,
      joinedRoomId,
      hasJoinedActiveRoom,
      isJoinPending,
      pendingJoinRoomId,
      isLeavePending,
      pendingLeaveRoomId,
      handleJoinRoom,
      handleLeaveRoom,
    }),
});
