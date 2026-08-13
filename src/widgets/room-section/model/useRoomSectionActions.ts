import { useRoomActions } from './useRoomActions';

interface UseRoomSectionActionsParams {
  selectedRoomId: number | null;
  isHostUser: boolean;
  myRoomId: number | null;
  onRequireLogin: () => void;
  setSelectedRoomId: (roomId: number | null) => void;
}

export const useRoomSectionActions = ({
  selectedRoomId,
  isHostUser,
  myRoomId,
  onRequireLogin,
  setSelectedRoomId,
}: UseRoomSectionActionsParams) =>
  useRoomActions({
    selectedRoomId,
    isHost: isHostUser,
    onRequireLogin,
    setSelectedRoomId,
    initialJoinedRoomId: myRoomId,
  });
