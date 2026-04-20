import { useQueryClient } from '@tanstack/react-query';
import {
  formatLunchAt,
  getDetailRoomCurrentCount,
  roomQueryKeys,
  toDetailRoomStatus,
  toDetailRoomType,
} from '@/entities/room';
import { useInfiniteRooms } from './useInfiniteRooms';
import { useRoomActions } from './useRoomActions';
import { useRoomMembers } from './useRoomMembers';
import { useRoomSelection } from './useRoomSelection';
import { resolveInitialJoinedRoomId } from './resolveInitialJoinedRoomId';
import { useRoomSectionViewModel } from './useRoomSectionViewModel';

interface UseRoomSectionParams {
  onRequireLogin: () => void;
}

export const useRoomSection = ({
  onRequireLogin,
}: UseRoomSectionParams) => {
  const queryClient = useQueryClient();
  const infiniteRooms = useInfiniteRooms();
  
  const roomSelection = useRoomSelection({
    rooms: infiniteRooms.rooms,
  });

  const roomMembers = useRoomMembers({
    selectedRoomId: roomSelection.selectedRoomId,
    selectedRoomDetail: roomSelection.selectedRoomDetail,
  });
  const initialJoinedRoomId = resolveInitialJoinedRoomId({
    selectedRoomId: roomSelection.selectedRoomId,
    currentUserId: roomMembers.currentUserId,
    roomMembers: roomMembers.roomMembers,
  });

  const roomActions = useRoomActions({
    selectedRoomId: roomSelection.selectedRoomId,
    isHost: roomMembers.isHostUser,
    onRequireLogin,
    invalidateRoomCaches: async (roomId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: roomQueryKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: roomQueryKeys.detail(roomId) }),
      ]);
    },
    setSelectedRoomId: roomSelection.setSelectedRoomId,
    initialJoinedRoomId,
  });

  return useRoomSectionViewModel({
    infiniteRooms,
    roomSelection,
    roomMembers,
    roomActions,
    formatLunchAt,
    getDetailRoomCurrentCount,
    toDetailRoomType,
    toDetailRoomStatus,
  });
};
