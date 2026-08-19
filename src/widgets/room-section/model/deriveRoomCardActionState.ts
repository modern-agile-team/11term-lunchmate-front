import type { MainRoom } from '@/entities/room';

interface DeriveRoomCardActionStateParams {
  room: MainRoom;
  joinedRoomId: number | null;
  hasJoinedActiveRoom: boolean;
  isJoinPending: boolean;
  pendingJoinRoomId: number | null;
  isLeavePending: boolean;
  pendingLeaveRoomId: number | null;
  handleJoinRoom: (roomId: number) => Promise<void>;
  handleLeaveRoom: (roomId: number) => Promise<void>;
}

export const deriveRoomCardActionState = ({
  room,
  joinedRoomId,
  hasJoinedActiveRoom,
  isJoinPending,
  pendingJoinRoomId,
  isLeavePending,
  pendingLeaveRoomId,
  handleJoinRoom,
  handleLeaveRoom,
}: DeriveRoomCardActionStateParams) => {
  const isActionPending =
    (isJoinPending && pendingJoinRoomId === room.id) ||
    (isLeavePending && pendingLeaveRoomId === room.id);
  const isJoinedRoom = joinedRoomId === room.id;
  const isFullRoom = room.currentCount >= room.capacity;
  const isRoomInactive = room.status === 'CLOSE' || room.status === 'COMPLETE';

  if (isRoomInactive) {
    return {
      isActionPending: false,
      isInactive: true,
      actionDisabled: true,
      actionLabel: room.status === 'COMPLETE' ? '완료된 방이에요' : '종료된 방이에요',
      onActionClick: handleJoinRoom,
    };
  }

  return {
    isActionPending,
    isInactive: false,
    actionDisabled: isJoinedRoom
      ? isActionPending
      : isFullRoom || isActionPending || hasJoinedActiveRoom,
    actionLabel: isJoinedRoom
      ? '나가기'
      : isFullRoom
        ? '정원 마감'
        : hasJoinedActiveRoom
          ? '다른 방 참여 중'
          : '참여하기',
    onActionClick: isJoinedRoom ? handleLeaveRoom : handleJoinRoom,
  };
};
