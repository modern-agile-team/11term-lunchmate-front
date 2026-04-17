import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { isAxiosError } from 'axios';

import { isAuthenticated } from '@/features/auth';
import { joinRoom, leaveRoom } from '@/features/room-actions';
import { getApiMessage } from './helpers';

type MessageTone = 'success' | 'error';

interface UseRoomParticipationParams {
  onRequireLogin: () => void;
  invalidateRoomCaches: (roomId: number) => Promise<unknown>;
  setActionMessage: (message: string) => void;
  setActionTone: (tone: MessageTone) => void;
  initialJoinedRoomId?: number | null;
}

export const useRoomParticipation = ({
  onRequireLogin,
  invalidateRoomCaches,
  setActionMessage,
  setActionTone,
  initialJoinedRoomId = null,
}: UseRoomParticipationParams) => {
  const [joinedRoomId, setJoinedRoomId] = useState<number | null>(initialJoinedRoomId);

  const joinRoomMutation = useMutation({
    mutationFn: (roomId: number) => joinRoom(roomId),
  });

  const leaveRoomMutation = useMutation({
    mutationFn: (roomId: number) => leaveRoom(roomId),
  });

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
    joinedRoomId,
    setJoinedRoomId,
    handleJoinRoom,
    handleLeaveRoom,
    isJoinPending: joinRoomMutation.isPending,
    pendingJoinRoomId: joinRoomMutation.variables ?? null,
    isLeavePending: leaveRoomMutation.isPending,
    pendingLeaveRoomId: leaveRoomMutation.variables ?? null,
  };
};
