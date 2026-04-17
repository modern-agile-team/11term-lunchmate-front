import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { isAxiosError } from 'axios';

import { isAuthenticated } from '@/features/auth';
import { deleteRoom, kickRoomMember } from '@/features/room-actions';
import { getApiMessage } from './helpers';

type MessageTone = 'success' | 'error';

interface UseRoomModerationParams {
  selectedRoomId: number | null;
  isHost: boolean;
  onRequireLogin: () => void;
  invalidateRoomCaches: (roomId: number) => Promise<unknown>;
  setSelectedRoomId: (roomId: number | null) => void;
  actionMessage: string;
  setActionMessage: (message: string) => void;
  actionTone: MessageTone;
  setActionTone: (tone: MessageTone) => void;
  isDeleteConfirmOpen: boolean;
  setIsDeleteConfirmOpen: (open: boolean) => void;
}

export const useRoomModeration = ({
  selectedRoomId,
  isHost,
  onRequireLogin,
  invalidateRoomCaches,
  setSelectedRoomId,
  setActionMessage,
  setActionTone,
  isDeleteConfirmOpen,
  setIsDeleteConfirmOpen,
}: UseRoomModerationParams) => {
  const [kickingMemberId, setKickingMemberId] = useState<number | null>(null);

  const deleteRoomMutation = useMutation({
    mutationFn: (roomId: number) => deleteRoom(roomId),
  });

  const kickMemberMutation = useMutation({
    mutationFn: ({ roomId, memberId }: { roomId: number; memberId: number }) =>
      kickRoomMember({roomId, userId: memberId}),
  });

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
      setIsDeleteConfirmOpen(false);
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

  return {
    isDeleteConfirmOpen,
    setIsDeleteConfirmOpen,
    kickingMemberId,
    handleDeleteRoom,
    handleKickMember,
    isDeletePending: deleteRoomMutation.isPending,
    isKickPending: kickMemberMutation.isPending,
  };
};