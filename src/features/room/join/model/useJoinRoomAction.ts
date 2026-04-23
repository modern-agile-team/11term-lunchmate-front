import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { isAuthenticated } from '@/shared/lib/auth/session';
import { joinRoom } from '../api';

interface UseJoinRoomActionParams {
  onRequireLogin: () => void;
  invalidateRoomCaches: (roomId: number) => Promise<unknown>;
  setActionMessage: (message: string) => void;
  setActionTone: (tone: 'success' | 'error') => void;
  setJoinedRoomId: (roomId: number | null) => void;
  getApiMessage: (error: unknown, fallbackMessage: string) => string;
}

export const useJoinRoomAction = ({
  onRequireLogin,
  invalidateRoomCaches,
  setActionMessage,
  setActionTone,
  setJoinedRoomId,
  getApiMessage,
}: UseJoinRoomActionParams) => {
  const joinRoomMutation = useMutation({ mutationFn: (roomId: number) => joinRoom(roomId) });

  const handleJoinRoom = async (roomId: number) => {
    if (!isAuthenticated()) {
      setActionMessage('로그인 후 방에 참여할 수 있어요.');
      setActionTone('error');
      onRequireLogin();
      return;
    }

    try {
      await joinRoomMutation.mutateAsync(roomId);
      setJoinedRoomId(roomId);
      setActionMessage('방에 참여했어요.');
      setActionTone('success');
      await invalidateRoomCaches(roomId);
    } catch (error) {
      setActionTone('error');
      if (isAxiosError(error) && error.response?.status === 401) {
        setActionMessage('로그인 후 방에 참여할 수 있어요.');
        onRequireLogin();
        return;
      }
      setActionMessage(getApiMessage(error, '방 참여에 실패했어요.'));
    }
  };

  return {
    handleJoinRoom,
    isJoinPending: joinRoomMutation.isPending,
    pendingJoinRoomId: joinRoomMutation.variables ?? null,
  };
};
