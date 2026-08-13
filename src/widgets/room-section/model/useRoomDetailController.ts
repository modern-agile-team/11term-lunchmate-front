import { useCompleteRoomAction } from '@/features/room/complete';
import { useDeleteRoomAction } from '@/features/room/delete';
import { useJoinRoomAction } from '@/features/room/join';
import { useKickRoomMemberAction } from '@/features/room/kick-member';
import { useLeaveRoomAction } from '@/features/room/leave';
import { getApiMessage } from '@/shared/lib/api/getApiMessage';

interface UseRoomDetailControllerParams {
  selectedRoomId: number | null;
  isHost: boolean;
  onRequireLogin: () => void;
  invalidateRoomCaches: (roomId: number) => Promise<unknown>;
  setSelectedRoomId: (roomId: number | null) => void;
  setActionMessage: (message: string) => void;
  setActionTone: (tone: 'success' | 'error') => void;
  setJoinedRoomId: (roomId: number | null) => void;
  closeConfirm: () => void;
}

export const useRoomDetailController = ({
  selectedRoomId,
  isHost,
  onRequireLogin,
  invalidateRoomCaches,
  setSelectedRoomId,
  setActionMessage,
  setActionTone,
  setJoinedRoomId,
  closeConfirm,
}: UseRoomDetailControllerParams) => {
  const sharedParams = {
    onRequireLogin,
    invalidateRoomCaches,
    setActionMessage,
    setActionTone,
    getApiMessage,
  };

  const joinAction = useJoinRoomAction({
    ...sharedParams,
    setJoinedRoomId,
  });
  const leaveAction = useLeaveRoomAction({
    ...sharedParams,
    setJoinedRoomId,
    closeConfirm,
  });
  const deleteAction = useDeleteRoomAction({
    selectedRoomId,
    isHost,
    setSelectedRoomId,
    closeConfirm,
    ...sharedParams,
  });
  const kickAction = useKickRoomMemberAction({
    selectedRoomId,
    isHost,
    closeConfirm,
    ...sharedParams,
  });
  const completeAction = useCompleteRoomAction({
    selectedRoomId,
    isHost,
    closeConfirm,
    ...sharedParams,
  });

  return {
    joinAction,
    leaveAction,
    deleteAction,
    kickAction,
    completeAction,
  };
};
