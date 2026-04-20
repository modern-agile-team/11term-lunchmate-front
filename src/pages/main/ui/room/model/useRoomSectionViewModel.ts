import type { RoomDetailResponse } from '@/entities/room';
import { detailRoomStatusStyleMap, detailRoomTypeStyleMap } from './constants';
import { buildRoomSectionDetail } from './buildRoomSectionDetail';
import { buildRoomSectionDialogs } from './buildRoomSectionDialogs';
import { buildRoomSectionMeta } from './buildRoomSectionMeta';
import type { useInfiniteRooms } from './useInfiniteRooms';
import type { useRoomActions } from './useRoomActions';
import type { useRoomMembers } from './useRoomMembers';
import type { useRoomSelection } from './useRoomSelection';

interface UseRoomSectionViewModelParams {
  infiniteRooms: ReturnType<typeof useInfiniteRooms>;
  roomSelection: ReturnType<typeof useRoomSelection>;
  roomMembers: ReturnType<typeof useRoomMembers>;
  roomActions: ReturnType<typeof useRoomActions>;
  formatLunchAt: (lunchAt: string) => string;
  getDetailRoomCurrentCount: (roomDetail: RoomDetailResponse) => number;
  toDetailRoomType: (
    roomType: RoomDetailResponse['roomType'],
  ) => keyof typeof detailRoomTypeStyleMap;
  toDetailRoomStatus: (
    status: RoomDetailResponse['status'],
  ) => keyof typeof detailRoomStatusStyleMap;
}

export const useRoomSectionViewModel = ({
  infiniteRooms,
  roomSelection,
  roomMembers,
  roomActions,
  formatLunchAt,
  getDetailRoomCurrentCount,
  toDetailRoomType,
  toDetailRoomStatus,
}: UseRoomSectionViewModelParams) => {
  const detailDisplay = buildRoomSectionDetail({
    roomDetail: roomSelection.roomDetailQuery.data,
    formatLunchAt,
    getDetailRoomCurrentCount,
    toDetailRoomType,
    toDetailRoomStatus,
  });
  const dialogs = buildRoomSectionDialogs({
    isEditRoomModalOpen: roomActions.isEditRoomModalOpen,
    setIsEditRoomModalOpen: roomActions.setIsEditRoomModalOpen,
    editRoomInitialValues: roomSelection.editRoomInitialValues,
    editRoomId: roomSelection.editRoomId,
    handleEditRoomSuccess: roomActions.handleEditRoomSuccess,
  });
  const meta = buildRoomSectionMeta({
    isRoomListLoading: infiniteRooms.roomsQuery.isLoading,
    isRoomListError: infiniteRooms.roomsQuery.isError,
    selectedRoomId: roomSelection.selectedRoomId,
    editRoomId: roomSelection.editRoomId,
    editRoomInitialValues: roomSelection.editRoomInitialValues,
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
      selectedRoomId: roomSelection.selectedRoomId,
      setSelectedRoomId: roomSelection.setSelectedRoomId,
      getRoomCardActionState: roomActions.getRoomCardActionState,
    },
    detail: {
      roomDetailQuery: roomSelection.roomDetailQuery,
      roomMembersQuery: roomMembers.roomMembersQuery,
      roomMembers: roomMembers.roomMembers,
      currentUserId: roomMembers.currentUserId,
      isHostUser: roomMembers.isHostUser,
      detailDisplay,
      actions: {
        openEditModal: () => roomActions.setIsEditRoomModalOpen(true),
        deleteRoom: roomActions.handleDeleteRoom,
        kickMember: roomActions.handleKickMember,
      },
    },
    dialogs,
    meta,
  };
};
