import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { isAuthenticated } from '@/shared/lib/auth/session';
import { completeRoom } from '../api';

interface UseCompleteRoomActionParams {
  selectedRoomId: number | null;
  isHost: boolean;
  onRequireLogin: () => void;
  invalidateRoomCaches: (roomId: number) => Promise<unknown>;
  setActionMessage: (message: string) => void;
  setActionTone: (tone: 'success' | 'error') => void;
  closeConfirm: () => void;
  getApiMessage: (error: unknown, fallbackMessage: string) => string;
}

export const useCompleteRoomAction = ({
  selectedRoomId,
  isHost,
  onRequireLogin,
  invalidateRoomCaches,
  setActionMessage,
  setActionTone,
  closeConfirm,
  getApiMessage,
}: UseCompleteRoomActionParams) => {
  const completeRoomMutation = useMutation({
    mutationFn: (roomId: number) => completeRoom(roomId),
  });

  const handleCompleteRoom = async () => {
    if (selectedRoomId === null) return;
    if (!isAuthenticated()) {
      setActionMessage('로그인 후 방을 완료 처리할 수 있어요.');
      setActionTone('error');
      onRequireLogin();
      return;
    }
    if (!isHost) {
      setActionMessage('방장만 방을 완료 처리할 수 있어요.');
      setActionTone('error');
      return;
    }

    try {
      await completeRoomMutation.mutateAsync(selectedRoomId);
      closeConfirm();
      setActionMessage('방을 완료 처리했어요.');
      setActionTone('success');
      await invalidateRoomCaches(selectedRoomId);
    } catch (error) {
      setActionTone('error');
      if (isAxiosError(error) && error.response?.status === 401) {
        setActionMessage('로그인 후 방을 완료 처리할 수 있어요.');
        onRequireLogin();
        return;
      }
      setActionMessage(getApiMessage(error, '방 완료 처리에 실패했어요.'));
    }
  };

  return { handleCompleteRoom, isCompletePending: completeRoomMutation.isPending };
};
