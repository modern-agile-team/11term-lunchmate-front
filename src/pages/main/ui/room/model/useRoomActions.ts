import { buildRoomActionsFeedback } from './buildRoomActionsFeedback';
import { buildRoomCardActionHandlers } from './buildRoomCardActionHandlers';
import { useRoomActionState } from './useRoomActionState';
import { useRoomEditDialogState } from './useRoomEditDialogState';
import { useRoomFeatureActions } from './useRoomFeatureActions';
import { useRoomParticipationState } from './useRoomParticipationState';

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
  const editDialog = useRoomEditDialogState({ selectedRoomId, invalidateRoomCaches });
  const participationState = useRoomParticipationState({ initialJoinedRoomId });
  const { joinAction, leaveAction, deleteAction, kickAction } =
    useRoomFeatureActions({
      selectedRoomId,
      isHost,
      onRequireLogin,
      invalidateRoomCaches,
      setSelectedRoomId,
      actionState,
      participationState,
    });
  const feedback = buildRoomActionsFeedback({
    actionMessage: actionState.actionMessage,
    actionTone: actionState.actionTone,
    resetActionState: actionState.resetActionState,
  });
  const cardActions = buildRoomCardActionHandlers({
    joinedRoomId: participationState.joinedRoomId,
    hasJoinedActiveRoom: participationState.hasJoinedActiveRoom,
    isJoinPending: joinAction.isJoinPending,
    pendingJoinRoomId: joinAction.pendingJoinRoomId,
    isLeavePending: leaveAction.isLeavePending,
    pendingLeaveRoomId: leaveAction.pendingLeaveRoomId,
    handleJoinRoom: joinAction.handleJoinRoom,
    handleLeaveRoom: leaveAction.handleLeaveRoom,
  });

  return {
    ...actionState,
    ...joinAction,
    ...leaveAction,
    ...deleteAction,
    ...kickAction,
    ...participationState,
    ...feedback,
    ...editDialog,
    ...cardActions,
  };
};
