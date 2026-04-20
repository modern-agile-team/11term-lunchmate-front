import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { isAxiosError } from 'axios';
import { isAuthenticated } from '@/shared/lib/auth/session';
import { kickRoomMember } from '../api';

interface UseKickRoomMemberActionParams {
  selectedRoomId: number | null;
  isHost: boolean;
  onRequireLogin: () => void;
  invalidateRoomCaches: (roomId: number) => Promise<unknown>;
  setActionMessage: (message: string) => void;
  setActionTone: (tone: 'success' | 'error') => void;
  getApiMessage: (error: unknown, fallbackMessage: string) => string;
}

export const useKickRoomMemberAction = ({
  selectedRoomId,
  isHost,
  onRequireLogin,
  invalidateRoomCaches,
  setActionMessage,
  setActionTone,
  getApiMessage,
}: UseKickRoomMemberActionParams) => {
  const [kickingMemberId, setKickingMemberId] = useState<number | null>(null);
  const kickMemberMutation = useMutation({
    mutationFn: ({ roomId, memberId }: { roomId: number; memberId: number }) =>
      kickRoomMember({ roomId, userId: memberId }),
  });

  const handleKickMember = async (memberId: number) => {
    if (selectedRoomId === null) return;
    if (!isAuthenticated()) {
      setActionMessage('로그인 후 멤버를 강퇴할 수 있어요.');
      setActionTone('error');
      onRequireLogin();
      return;
    }
    if (!isHost) {
      setActionMessage('방장만 멤버를 강퇴할 수 있어요.');
      setActionTone('error');
      return;
    }

    try {
      setKickingMemberId(memberId);
      await kickMemberMutation.mutateAsync({ roomId: selectedRoomId, memberId });
      setActionMessage('멤버를 강퇴했어요.');
      setActionTone('success');
      await invalidateRoomCaches(selectedRoomId);
    } catch (error) {
      setActionTone('error');
      if (isAxiosError(error) && error.response?.status === 401) {
        setActionMessage('로그인 후 멤버를 강퇴할 수 있어요.');
        onRequireLogin();
        return;
      }
      setActionMessage(getApiMessage(error, '멤버 강퇴에 실패했어요.'));
    } finally {
      setKickingMemberId(null);
    }
  };

  return { kickingMemberId, handleKickMember, isKickPending: kickMemberMutation.isPending };
};
