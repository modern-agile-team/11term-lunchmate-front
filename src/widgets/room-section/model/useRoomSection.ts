import { useRoomSectionActions } from './useRoomSectionActions';
import { useRoomSectionData } from './useRoomSectionData';
import { useRoomSectionMeta } from './useRoomSectionMeta';

interface UseRoomSectionParams {
  onRequireLogin: () => void;
}

export const useRoomSection = ({
  onRequireLogin,
}: UseRoomSectionParams) => {
  const {
    infiniteRooms,
    roomSelectionState,
    selectedRoomDetailState,
    roomEditTarget,
    roomMembers,
  } = useRoomSectionData();
  const roomActions = useRoomSectionActions({
    selectedRoomId: roomSelectionState.selectedRoomId,
    currentUserId: roomMembers.currentUserId,
    roomMembers: roomMembers.roomMembers,
    isHostUser: roomMembers.isHostUser,
    onRequireLogin,
    setSelectedRoomId: roomSelectionState.setSelectedRoomId,
  });
  const { detailDisplay, meta } = useRoomSectionMeta({
    isRoomListLoading: infiniteRooms.roomsQuery.isLoading,
    isRoomListError: infiniteRooms.roomsQuery.isError,
    selectedRoomId: roomSelectionState.selectedRoomId,
    roomDetail: selectedRoomDetailState.roomDetailQuery.data,
    editRoomId: roomEditTarget.editRoomId,
    editRoomInitialValues: roomEditTarget.editRoomInitialValues,
    roomActionMessage: roomActions.roomActionMessage,
    roomActionMessageTone: roomActions.roomActionMessageTone,
  });

  return {
    filter: {
      roomFilterState: infiniteRooms.roomFilterState,
      setRoomFilterState: infiniteRooms.setRoomFilterState,
    },
    list: {
      roomListLoadMoreRef: infiniteRooms.roomListLoadMoreRef,
      roomsQuery: infiniteRooms.roomsQuery,
      rooms: infiniteRooms.rooms,
      selectedRoomId: roomSelectionState.selectedRoomId,
      setSelectedRoomId: roomSelectionState.setSelectedRoomId,
      getRoomCardActionState: roomActions.getRoomCardActionState,
    },
    detail: {
      roomDetailQuery: selectedRoomDetailState.roomDetailQuery,
      roomMembersQuery: roomMembers.roomMembersQuery,
      roomMembers: roomMembers.roomMembers,
      currentUserId: roomMembers.currentUserId,
      isHostUser: roomMembers.isHostUser,
      detailDisplay,
      onEdit: () => roomActions.setIsEditRoomModalOpen(true),
      onDelete: roomActions.handleDeleteRoom,
      onKickMember: roomActions.handleKickMember,
    },
    dialogs: {
      isEditRoomModalOpen: roomActions.isEditRoomModalOpen,
      setIsEditRoomModalOpen: roomActions.setIsEditRoomModalOpen,
      editRoomInitialValues: roomEditTarget.editRoomInitialValues,
      editRoomId: roomEditTarget.editRoomId,
      handleEditRoomSuccess: roomActions.handleEditRoomSuccess,
    },
    meta,
  };
};
