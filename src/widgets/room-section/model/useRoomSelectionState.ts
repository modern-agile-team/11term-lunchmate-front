import { useMemo, useState } from 'react';
import type { MainRoom } from '@/entities/room';

interface UseRoomSelectionStateParams {
  rooms: MainRoom[];
}

export const useRoomSelectionState = ({ rooms }: UseRoomSelectionStateParams) => {
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  const selectedRoom = useMemo(
    () => rooms.find((room) => room.id === selectedRoomId) ?? null,
    [rooms, selectedRoomId],
  );

  const handleSelectRoom = (roomId: number) => {
    setSelectedRoomId(roomId);
  };

  return {
    selectedRoomId,
    setSelectedRoomId,
    selectedRoom,
    handleSelectRoom,
  };
};
