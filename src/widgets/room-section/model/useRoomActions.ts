import { useQueryClient } from '@tanstack/react-query';
import type { MainRoom } from '@/entities/room';
import { invalidateRoomCaches } from '@/entities/room';
import { useQuickJoinAction } from '@/features/room/quick-join';
import { getApiMessage } from '@/shared/lib/api/getApiMessage';
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
  const { joinAction, leaveAction, deleteAction, kickAction, completeAction } =
    useRoomDetailController({
      selectedRoomId,
      isHost,
      onRequireLogin,
      invalidateRoomCaches: invalidateCaches,
      setSelectedRoomId,
      setActionMessage: actionFeedback.setActionMessage,
      setActionTone: actionFeedback.setActionTone,
      setJoinedRoomId: participationState.setJoinedRoomId,
      closeConfirm: actionFeedback.closeConfirmTarget,
    });
  const quickJoinAction = useQuickJoinAction({
    onRequireLogin,
    invalidateRoomCaches: invalidateCaches,
    setActionMessage: actionFeedback.setActionMessage,
    setActionTone: actionFeedback.setActionTone,
    setSelectedRoomId,
    setJoinedRoomId: participationState.setJoinedRoomId,
    getApiMessage,
  });

  return {
    ...actionFeedback,
    ...joinAction,
    ...leaveAction,
    ...deleteAction,
    ...kickAction,
    ...completeAction,
    ...quickJoinAction,
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
