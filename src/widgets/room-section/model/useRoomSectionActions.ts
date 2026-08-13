import { resolveInitialJoinedRoomId } from './resolveInitialJoinedRoomId';
import { useRoomActions } from './useRoomActions';

interface UseRoomSectionActionsParams {
  selectedRoomId: number | null;
  currentUserId: number | null;
  roomMembers: { id: number }[];
  isHostUser: boolean;
  onRequireLogin: () => void;
  setSelectedRoomId: (roomId: number | null) => void;
}

export const useRoomSectionActions = ({
  selectedRoomId,
  currentUserId,
  roomMembers,
  isHostUser,
  onRequireLogin,
  setSelectedRoomId,
}: UseRoomSectionActionsParams) => {
  const initialJoinedRoomId = resolveInitialJoinedRoomId({
    selectedRoomId,
    currentUserId,
    roomMembers,
  });

  return useRoomActions({
    selectedRoomId,
    isHost: isHostUser,
    onRequireLogin,
    setSelectedRoomId,
    initialJoinedRoomId,
  });
};
