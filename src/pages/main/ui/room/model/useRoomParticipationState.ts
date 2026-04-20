import { useState } from 'react';

interface UseRoomParticipationStateParams {
  initialJoinedRoomId?: number | null;
}

export const useRoomParticipationState = ({
  initialJoinedRoomId = null,
}: UseRoomParticipationStateParams) => {
  const [joinedRoomId, setJoinedRoomId] = useState<number | null>(initialJoinedRoomId);

  return {
    joinedRoomId,
    setJoinedRoomId,
    hasJoinedActiveRoom: joinedRoomId !== null,
  };
};
