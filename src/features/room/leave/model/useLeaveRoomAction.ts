import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { isAuthenticated } from '@/shared/lib/auth/session';
import { leaveRoom } from '../api';

interface UseLeaveRoomActionParams {
  onRequireLogin: () => void;
  invalidateRoomCaches: (roomId: number) => Promise<unknown>;
  setActionMessage: (message: string) => void;
  setActionTone: (tone: 'success' | 'error') => void;
  setJoinedRoomId: (roomId: number | null) => void;
  getApiMessage: (error: unknown, fallbackMessage: string) => string;
}

export const useLeaveRoomAction = ({
  onRequireLogin,
  invalidateRoomCaches,
  setActionMessage,
  setActionTone,
  setJoinedRoomId,
  getApiMessage,
}: UseLeaveRoomActionParams) => {
  const leaveRoomMutation = useMutation({ mutationFn: (roomId: number) => leaveRoom(roomId) });

  const handleLeaveRoom = async (roomId: number) => {
    if (!isAuthenticated()) {
      setActionMessage('로그인 후 방에서 나갈 수 있어요.');
      setActionTone('error');
      onRequireLogin();
      return;
    }

    try {
      await leaveRoomMutation.mutateAsync(roomId);
      setJoinedRoomId(null);
      setActionMessage('방에서 나갔어요.');
      setActionTone('success');
      await invalidateRoomCaches(roomId);
    } catch (error) {
      setActionTone('error');
      if (isAxiosError(error) && error.response?.status === 401) {
        setActionMessage('로그인 후 방에서 나갈 수 있어요.');
        onRequireLogin();
        return;
      }
      setActionMessage(getApiMessage(error, '방 나가기에 실패했어요.'));
    }
  };

  return {
    handleLeaveRoom,
    isLeavePending: leaveRoomMutation.isPending,
    pendingLeaveRoomId: leaveRoomMutation.variables ?? null,
  };
};
