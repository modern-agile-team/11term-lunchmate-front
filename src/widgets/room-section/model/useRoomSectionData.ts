import { useQuery } from '@tanstack/react-query';
import { myRoomQueryOptions } from '@/entities/room';
import { isAuthenticated } from '@/shared/lib/auth/session';
import { useInfiniteRooms } from './useInfiniteRooms';
import { useRoomEditTarget } from './useRoomEditTarget';
import { useRoomMembers } from './useRoomMembers';
import { useRoomSelectionState } from './useRoomSelectionState';
import { useSelectedRoomDetail } from './useSelectedRoomDetail';

export const useRoomSectionData = () => {
  const infiniteRooms = useInfiniteRooms();
  const roomSelectionState = useRoomSelectionState({
    rooms: infiniteRooms.rooms,
  });
  const selectedRoomDetailState = useSelectedRoomDetail({
    selectedRoomId: roomSelectionState.selectedRoomId,
  });
  const roomEditTarget = useRoomEditTarget({
    selectedRoomDetail: selectedRoomDetailState.selectedRoomDetail,
  });
  const roomMembers = useRoomMembers({
    selectedRoomId: roomSelectionState.selectedRoomId,
    selectedRoomDetail: selectedRoomDetailState.selectedRoomDetail,
  });
  const myRoomQuery = useQuery({
    ...myRoomQueryOptions(),
    enabled: isAuthenticated(),
  });

  return {
    infiniteRooms,
    roomSelectionState,
    selectedRoomDetailState,
    roomEditTarget,
    roomMembers,
    myRoomQuery,
  };
};
