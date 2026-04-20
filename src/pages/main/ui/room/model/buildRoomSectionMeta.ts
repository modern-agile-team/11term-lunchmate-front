interface BuildRoomSectionMetaParams {
  isRoomListLoading: boolean;
  isRoomListError: boolean;
  selectedRoomId: number | null;
  editRoomId: number | undefined;
  editRoomInitialValues: unknown;
  roomActionMessage: string;
  roomActionMessageTone: 'success' | 'error';
}

export const buildRoomSectionMeta = ({
  isRoomListLoading,
  isRoomListError,
  selectedRoomId,
  editRoomId,
  editRoomInitialValues,
  roomActionMessage,
  roomActionMessageTone,
}: BuildRoomSectionMetaParams) => {
  const isRoomListReady = !isRoomListLoading && !isRoomListError;

  return {
    isRoomListReady,
    shouldShowDetail: selectedRoomId !== null && isRoomListReady,
    shouldShowEditModal: Boolean(editRoomId && editRoomInitialValues),
    roomActionMessage,
    roomActionMessageTone,
  };
};
