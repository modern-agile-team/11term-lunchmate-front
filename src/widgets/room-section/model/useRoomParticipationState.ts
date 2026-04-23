import { useState } from 'react';

interface UseRoomParticipationStateParams {
  initialJoinedRoomId?: number | null;
}

export const useRoomParticipationState = ({
  initialJoinedRoomId = null,
}: UseRoomParticipationStateParams) => {
  const baselineJoinedRoomId = initialJoinedRoomId ?? null;
  const [overrideState, setOverrideState] = useState<{
    baselineJoinedRoomId: number | null;
    nextJoinedRoomId: number | null;
  } | null>(null);

  const joinedRoomId =
    overrideState?.baselineJoinedRoomId === baselineJoinedRoomId
      ? overrideState.nextJoinedRoomId
      : baselineJoinedRoomId;

  const setJoinedRoomId = (roomId: number | null) => {
    setOverrideState({
      baselineJoinedRoomId,
      nextJoinedRoomId: roomId,
    });
  };

  return {
    joinedRoomId,
    setJoinedRoomId,
    hasJoinedActiveRoom: joinedRoomId !== null,
  };
};
