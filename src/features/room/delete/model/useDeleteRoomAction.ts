import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { isAuthenticated } from '@/shared/lib/auth/session';
import { deleteRoom } from '../api';

interface UseDeleteRoomActionParams {
  selectedRoomId: number | null;
  isHost: boolean;
  onRequireLogin: () => void;
  invalidateRoomCaches: (roomId: number) => Promise<unknown>;
  setSelectedRoomId: (roomId: number | null) => void;
  setActionMessage: (message: string) => void;
  setActionTone: (tone: 'success' | 'error') => void;
  closeDeleteConfirm: () => void;
  getApiMessage: (error: unknown, fallbackMessage: string) => string;
}

export const useDeleteRoomAction = ({
  selectedRoomId,
  isHost,
  onRequireLogin,
  invalidateRoomCaches,
  setSelectedRoomId,
  setActionMessage,
  setActionTone,
  closeDeleteConfirm,
  getApiMessage,
}: UseDeleteRoomActionParams) => {
  const deleteRoomMutation = useMutation({ mutationFn: (roomId: number) => deleteRoom(roomId) });

  const handleDeleteRoom = async () => {
    if (selectedRoomId === null) return;
    if (!isAuthenticated()) {
      setActionMessage('로그인 후 방을 삭제할 수 있어요.');
      setActionTone('error');
      onRequireLogin();
      return;
    }
    if (!isHost) {
      setActionMessage('방장만 방을 삭제할 수 있어요.');
      setActionTone('error');
      return;
    }

    try {
      await deleteRoomMutation.mutateAsync(selectedRoomId);
      closeDeleteConfirm();
      setSelectedRoomId(null);
      setActionMessage('방을 삭제했어요.');
      setActionTone('success');
      await invalidateRoomCaches(selectedRoomId);
    } catch (error) {
      setActionTone('error');
      if (isAxiosError(error) && error.response?.status === 401) {
        setActionMessage('로그인 후 방을 삭제할 수 있어요.');
        onRequireLogin();
        return;
      }
      setActionMessage(getApiMessage(error, '방 삭제에 실패했어요.'));
    }
  };

  return { handleDeleteRoom, isDeletePending: deleteRoomMutation.isPending };
};
