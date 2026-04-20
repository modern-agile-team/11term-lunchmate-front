import { useDeleteRoomAction } from '@/features/room/delete';
import { useJoinRoomAction } from '@/features/room/join';
import { useKickRoomMemberAction } from '@/features/room/kick-member';
import { useLeaveRoomAction } from '@/features/room/leave';
import { getApiMessage } from './helpers';
import { useRoomActionState } from './useRoomActionState';
import { useRoomParticipationState } from './useRoomParticipationState';

interface UseRoomFeatureActionsParams {
  selectedRoomId: number | null;
  isHost: boolean;
  onRequireLogin: () => void;
  invalidateRoomCaches: (roomId: number) => Promise<unknown>;
  setSelectedRoomId: (roomId: number | null) => void;
  actionState: ReturnType<typeof useRoomActionState>;
  participationState: ReturnType<typeof useRoomParticipationState>;
}

export const useRoomFeatureActions = ({
  selectedRoomId,
  isHost,
  onRequireLogin,
  invalidateRoomCaches,
  setSelectedRoomId,
  actionState,
  participationState,
}: UseRoomFeatureActionsParams) => {
  const sharedParams = {
    onRequireLogin,
    invalidateRoomCaches,
    setActionMessage: actionState.setActionMessage,
    setActionTone: actionState.setActionTone,
    getApiMessage,
  };

  const joinAction = useJoinRoomAction({
    ...sharedParams,
    setJoinedRoomId: participationState.setJoinedRoomId,
  });
  const leaveAction = useLeaveRoomAction({
    ...sharedParams,
    setJoinedRoomId: participationState.setJoinedRoomId,
  });
  const deleteAction = useDeleteRoomAction({
    selectedRoomId,
    isHost,
    setSelectedRoomId,
    closeDeleteConfirm: () => actionState.setIsDeleteConfirmOpen(false),
    ...sharedParams,
  });
  const kickAction = useKickRoomMemberAction({
    selectedRoomId,
    isHost,
    ...sharedParams,
  });

  return {
    joinAction,
    leaveAction,
    deleteAction,
    kickAction,
  };
};
