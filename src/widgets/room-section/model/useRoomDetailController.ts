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
  closeDeleteConfirm: () => void;
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
  closeDeleteConfirm,
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
  });
  const deleteAction = useDeleteRoomAction({
    selectedRoomId,
    isHost,
    setSelectedRoomId,
    closeDeleteConfirm,
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
