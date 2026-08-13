import { useMemo, useState } from 'react';
import type { MainRoom } from '@/entities/room';

interface UseRoomSelectionStateParams {
  rooms: MainRoom[];
}

export const useRoomSelectionState = ({ rooms }: UseRoomSelectionStateParams) => {
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  const effectiveSelectedRoomId = useMemo(() => {
    if (selectedRoomId === null) {
      return null;
    }

    return rooms.some((room) => room.id === selectedRoomId) ? selectedRoomId : null;
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
