import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { roomDetailQueryOptions, type MainRoom } from '@/entities/room';
import { toRoomEditorFormValues } from '@/features/room/edit';

interface UseRoomSelectionParams {
  rooms: MainRoom[];
}

export const useRoomSelection = ({ rooms }: UseRoomSelectionParams) => {
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  const effectiveSelectedRoomId = useMemo(() => {
    if (rooms.length === 0) return null;

    const hasSelected = selectedRoomId !== null && rooms.some((room) => room.id === selectedRoomId);

    if (hasSelected) return selectedRoomId;

    return rooms[0].id;
  }, [rooms, selectedRoomId]);
  
  const selectedRoom = useMemo(
    () => rooms.find((room) => room.id === effectiveSelectedRoomId) ?? null,
    [rooms, effectiveSelectedRoomId],
  );

  const roomDetailQuery = useQuery({
    ...roomDetailQueryOptions(effectiveSelectedRoomId ?? 0),
    enabled: effectiveSelectedRoomId !== null,
  });

  const selectedRoomDetail = roomDetailQuery.data ?? null;

  const handleSelectRoom = (roomId: number) => {
    setSelectedRoomId(roomId);
  }
  

  return {
    selectedRoomId: effectiveSelectedRoomId,
    setSelectedRoomId,
    selectedRoom,
    roomDetailQuery,
    selectedRoomDetail,
    editRoomId: selectedRoomDetail?.id,
    editRoomInitialValues:
      selectedRoomDetail !== null ? toRoomEditorFormValues(selectedRoomDetail) : undefined,
    handleSelectRoom,
  };
};
