import { useQueryClient } from '@tanstack/react-query';
import type { MainRoom } from '@/entities/room';
import { invalidateRoomCaches } from '@/entities/room';
import { deriveRoomCardActionState } from './deriveRoomCardActionState';
import { useRoomActionFeedback } from './useRoomActionFeedback';
import { useRoomDetailController } from './useRoomDetailController';
import { useRoomEditDialogState } from './useRoomEditDialogState';
import { useRoomParticipationState } from './useRoomParticipationState';

interface UseRoomActionsParams {
  selectedRoomId: number | null;
  isHost: boolean;
  onRequireLogin: () => void;
  setSelectedRoomId: (roomId: number | null) => void;
  initialJoinedRoomId?: number | null;
}

export const useRoomActions = ({
  selectedRoomId,
  isHost,
  onRequireLogin,
  setSelectedRoomId,
  initialJoinedRoomId = null,
}: UseRoomActionsParams) => {
  const queryClient = useQueryClient();
  const invalidateCaches = (roomId: number) => invalidateRoomCaches(queryClient, roomId);
  const actionFeedback = useRoomActionFeedback();
  const editDialog = useRoomEditDialogState({
    selectedRoomId,
    invalidateRoomCaches: invalidateCaches,
  });
  const participationState = useRoomParticipationState({ initialJoinedRoomId });
  const { joinAction, leaveAction, deleteAction, kickAction } =
    useRoomDetailController({
      selectedRoomId,
      isHost,
      onRequireLogin,
      invalidateRoomCaches: invalidateCaches,
      setSelectedRoomId,
      setActionMessage: actionFeedback.setActionMessage,
      setActionTone: actionFeedback.setActionTone,
      setJoinedRoomId: participationState.setJoinedRoomId,
      closeDeleteConfirm: () => actionFeedback.setIsDeleteConfirmOpen(false),
    });

  return {
    ...actionFeedback,
    ...joinAction,
    ...leaveAction,
    ...deleteAction,
    ...kickAction,
    ...participationState,
    ...editDialog,
    roomActionMessage: actionFeedback.actionMessage,
    roomActionMessageTone: actionFeedback.actionTone,
    getRoomCardActionState: (room: MainRoom) =>
      deriveRoomCardActionState({
        room,
        joinedRoomId: participationState.joinedRoomId,
        hasJoinedActiveRoom: participationState.hasJoinedActiveRoom,
        isJoinPending: joinAction.isJoinPending,
        pendingJoinRoomId: joinAction.pendingJoinRoomId,
        isLeavePending: leaveAction.isLeavePending,
        pendingLeaveRoomId: leaveAction.pendingLeaveRoomId,
        handleJoinRoom: joinAction.handleJoinRoom,
        handleLeaveRoom: leaveAction.handleLeaveRoom,
      }),
  };
};
