import { useQuery } from '@tanstack/react-query';
import { roomDetailQueryOptions } from '@/entities/room';

interface UseSelectedRoomDetailParams {
  selectedRoomId: number | null;
}

export const useSelectedRoomDetail = ({
  selectedRoomId,
}: UseSelectedRoomDetailParams) => {
  const roomDetailQuery = useQuery({
    ...roomDetailQueryOptions(selectedRoomId ?? 0),
    enabled: selectedRoomId !== null,
  });

  return {
    roomDetailQuery,
    selectedRoomDetail: roomDetailQuery.data ?? null,
  };
};
