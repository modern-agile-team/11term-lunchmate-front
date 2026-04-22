interface DeriveRoomSectionMetaParams {
  isRoomListLoading: boolean;
  isRoomListError: boolean;
  selectedRoomId: number | null;
  editRoomId: number | undefined;
  editRoomInitialValues: unknown;
  roomActionMessage: string;
  roomActionMessageTone: 'success' | 'error';
}

export const deriveRoomSectionMeta = ({
  isRoomListLoading,
  isRoomListError,
  selectedRoomId,
  editRoomId,
  editRoomInitialValues,
  roomActionMessage,
  roomActionMessageTone,
}: DeriveRoomSectionMetaParams) => {
  const isRoomListReady = !isRoomListLoading && !isRoomListError;

  return {
    isRoomListReady,
    shouldShowDetail: selectedRoomId !== null && isRoomListReady,
    shouldShowEditModal: Boolean(editRoomId && editRoomInitialValues),
    roomActionMessage,
    roomActionMessageTone,
  };
};
