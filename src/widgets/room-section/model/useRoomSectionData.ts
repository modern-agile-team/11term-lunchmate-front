import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { myRoomQueryOptions } from '@/entities/room';
import { authSessionSelectors, useAuthSessionStore } from '@/shared/lib/auth/session';
import { useInfiniteRooms } from './useInfiniteRooms';
import { useRoomEditTarget } from './useRoomEditTarget';
import { useRoomMembers } from './useRoomMembers';
import { useRoomRealtimeSync } from './useRoomRealtimeSync';
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
  const isAuthed = useAuthSessionStore(authSessionSelectors.isAuthenticated);
  const myRoomQuery = useQuery({
    ...myRoomQueryOptions(),
    enabled: isAuthed,
  });

  const realtimeRoomIds = useMemo(() => {
    const ids = infiniteRooms.rooms.map((room) => room.id);

    if (
      roomSelectionState.selectedRoomId !== null &&
      !ids.includes(roomSelectionState.selectedRoomId)
    ) {
      ids.push(roomSelectionState.selectedRoomId);
    }

    return ids;
  }, [infiniteRooms.rooms, roomSelectionState.selectedRoomId]);

  useRoomRealtimeSync({
    roomIds: realtimeRoomIds,
    onRoomDeleted: (roomId) => {
      if (roomSelectionState.selectedRoomId === roomId) {
        roomSelectionState.setSelectedRoomId(null);
      }
    },
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
