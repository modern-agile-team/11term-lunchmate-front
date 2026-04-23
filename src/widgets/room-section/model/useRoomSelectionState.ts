import { useMemo, useState } from 'react';
import type { MainRoom } from '@/entities/room';

interface UseRoomSelectionStateParams {
  rooms: MainRoom[];
}

export const useRoomSelectionState = ({ rooms }: UseRoomSelectionStateParams) => {
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  const effectiveSelectedRoomId = useMemo(() => {
    if (rooms.length === 0) {
      return null;
    }

    const hasSelected = selectedRoomId !== null && rooms.some((room) => room.id === selectedRoomId);

    return hasSelected ? selectedRoomId : rooms[0].id;
  }, [rooms, selectedRoomId]);

  const selectedRoom = useMemo(
    () => rooms.find((room) => room.id === effectiveSelectedRoomId) ?? null,
    [rooms, effectiveSelectedRoomId],
  );

  const handleSelectRoom = (roomId: number) => {
    setSelectedRoomId(roomId);
  };

  return {
    selectedRoomId: effectiveSelectedRoomId,
    setSelectedRoomId,
    selectedRoom,
    handleSelectRoom,
  };
};
