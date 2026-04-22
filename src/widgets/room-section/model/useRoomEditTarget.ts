import type { RoomDetailResponse } from '@/entities/room';
import { toRoomEditorFormValues } from '@/features/room/editor';

interface UseRoomEditTargetParams {
  selectedRoomDetail: RoomDetailResponse | null;
}

export const useRoomEditTarget = ({ selectedRoomDetail }: UseRoomEditTargetParams) => ({
  editRoomId: selectedRoomDetail?.id,
  editRoomInitialValues:
    selectedRoomDetail !== null ? toRoomEditorFormValues(selectedRoomDetail) : undefined,
});
