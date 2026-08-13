import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { isAuthenticated } from '@/shared/lib/auth/session';
import { quickJoinRoom } from '../api';

interface UseQuickJoinActionParams {
  onRequireLogin: () => void;
  invalidateRoomCaches: (roomId: number) => Promise<unknown>;
  setActionMessage: (message: string) => void;
  setActionTone: (tone: 'success' | 'error') => void;
  setSelectedRoomId: (roomId: number | null) => void;
  setJoinedRoomId: (roomId: number | null) => void;
  getApiMessage: (error: unknown, fallbackMessage: string) => string;
}

export const useQuickJoinAction = ({
  onRequireLogin,
  invalidateRoomCaches,
  setActionMessage,
  setActionTone,
  setSelectedRoomId,
  setJoinedRoomId,
  getApiMessage,
}: UseQuickJoinActionParams) => {
  const quickJoinMutation = useMutation({ mutationFn: quickJoinRoom });

  const handleQuickJoin = async () => {
    if (!isAuthenticated()) {
      setActionMessage('로그인 후 빠른 참여를 이용할 수 있어요.');
      setActionTone('error');
      onRequireLogin();
      return;
    }

    try {
      const result = await quickJoinMutation.mutateAsync();
      setJoinedRoomId(result.roomId);
      setSelectedRoomId(result.roomId);
      setActionMessage('빠른 참여로 방에 들어갔어요.');
      setActionTone('success');
      await invalidateRoomCaches(result.roomId);
    } catch (error) {
      setActionTone('error');
      if (isAxiosError(error) && error.response?.status === 401) {
        setActionMessage('로그인 후 빠른 참여를 이용할 수 있어요.');
        onRequireLogin();
        return;
      }
      if (isAxiosError(error) && error.response?.status === 404) {
        setActionMessage('조건에 맞는 방이 없어요.');
        return;
      }
      setActionMessage(getApiMessage(error, '빠른 참여에 실패했어요.'));
    }
  };

  return { handleQuickJoin, isQuickJoinPending: quickJoinMutation.isPending };
};
