import { deriveRoomSectionDetail } from './deriveRoomSectionDetail';
import { deriveRoomSectionMeta } from './deriveRoomSectionMeta';

interface UseRoomSectionMetaParams {
  isRoomListLoading: boolean;
  isRoomListError: boolean;
  selectedRoomId: number | null;
  roomDetail?: Parameters<typeof deriveRoomSectionDetail>[0]['roomDetail'];
  editRoomId: number | undefined;
  editRoomInitialValues: unknown;
  roomActionMessage: string;
  roomActionMessageTone: 'success' | 'error';
}

export const useRoomSectionMeta = ({
  isRoomListLoading,
  isRoomListError,
  selectedRoomId,
  roomDetail,
  editRoomId,
  editRoomInitialValues,
  roomActionMessage,
  roomActionMessageTone,
}: UseRoomSectionMetaParams) => {
  const detailDisplay = deriveRoomSectionDetail({
    roomDetail,
  });
  const meta = deriveRoomSectionMeta({
    isRoomListLoading,
    isRoomListError,
    selectedRoomId,
    editRoomId,
    editRoomInitialValues,
    roomActionMessage,
    roomActionMessageTone,
  });

  return {
    detailDisplay,
    meta,
  };
};
