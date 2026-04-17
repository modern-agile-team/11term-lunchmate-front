import type { MainRoom } from '@/entities/room';
import { useState } from 'react';
import { useRoomActionState } from './useRoomActionState';
import { useRoomModeration } from './useRoomModeration';
import { useRoomParticipation } from './useRoomParticipation';

interface UseRoomActionsParams {
  selectedRoomId: number | null;
  isHost: boolean;
  onRequireLogin: () => void;
  invalidateRoomCaches: (roomId: number) => Promise<unknown>;
  setSelectedRoomId: (roomId: number | null) => void;
  initialJoinedRoomId?: number | null;
}

export const useRoomActions = ({
  selectedRoomId,
  isHost,
  onRequireLogin,
  invalidateRoomCaches,
  setSelectedRoomId,
  initialJoinedRoomId = null,
}: UseRoomActionsParams) => {
  const actionState = useRoomActionState();
  const [isEditRoomModalOpen, setIsEditRoomModalOpen] = useState(false);

  const participation = useRoomParticipation({
    onRequireLogin,
    invalidateRoomCaches,
    setActionMessage: actionState.setActionMessage,
    setActionTone: actionState.setActionTone,
    initialJoinedRoomId,
  });

  const moderation = useRoomModeration({
    selectedRoomId,
    isHost,
    onRequireLogin,
    invalidateRoomCaches,
    setSelectedRoomId,
    actionMessage: actionState.actionMessage,
    setActionMessage: actionState.setActionMessage,
    actionTone: actionState.actionTone,
    setActionTone: actionState.setActionTone,
    isDeleteConfirmOpen: actionState.isDeleteConfirmOpen,
    setIsDeleteConfirmOpen: actionState.setIsDeleteConfirmOpen,
  });

  const hasJoinedActiveRoom = participation.joinedRoomId !== null;

  const getRoomCardActionState = (room: MainRoom) => {
    const isActionPending =
      (participation.isJoinPending && participation.pendingJoinRoomId === room.id) ||
      (participation.isLeavePending && participation.pendingLeaveRoomId === room.id);
    const isFullRoom = room.currentCount >= room.capacity;
    const isJoinedRoom = participation.joinedRoomId === room.id;
    const actionDisabled = isJoinedRoom
      ? isActionPending
      : isFullRoom || isActionPending || hasJoinedActiveRoom;
    const actionLabel = isJoinedRoom
      ? '나가기'
      : isFullRoom
        ? '정원 마감'
        : hasJoinedActiveRoom
          ? '다른 방 참여 중'
          : '참여하기';

    return {
      isActionPending,
      actionDisabled,
      actionLabel,
      onActionClick: isJoinedRoom ? participation.handleLeaveRoom : participation.handleJoinRoom,
    };
  };

  const handleEditRoomSuccess = async () => {
    if (selectedRoomId === null) return;
    setIsEditRoomModalOpen(false);
    await invalidateRoomCaches(selectedRoomId);
  };

  return {
    ...actionState,
    ...participation,
    ...moderation,
    roomActionMessage: actionState.actionMessage,
    roomActionMessageTone: actionState.actionTone,
    isEditRoomModalOpen,
    setIsEditRoomModalOpen,
    getRoomCardActionState,
    handleEditRoomSuccess,
  };
};
