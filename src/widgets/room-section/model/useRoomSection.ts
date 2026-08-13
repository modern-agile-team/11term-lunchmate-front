import { useEffect } from 'react';
import type { RoomSyncRequest } from '@/entities/room';
import { deriveRoomConfirmDialogConfig } from './deriveRoomConfirmDialogConfig';
import { useRoomSectionActions } from './useRoomSectionActions';
import { useRoomSectionData } from './useRoomSectionData';
import { useRoomSectionMeta } from './useRoomSectionMeta';

interface UseRoomSectionParams {
  onRequireLogin: () => void;
  roomSyncRequest: RoomSyncRequest | null;
  onRoomSyncHandled: () => void;
}

export const useRoomSection = ({
  onRequireLogin,
  roomSyncRequest,
  onRoomSyncHandled,
}: UseRoomSectionParams) => {
  const {
    infiniteRooms,
    roomSelectionState,
    selectedRoomDetailState,
    roomEditTarget,
    roomMembers,
    myRoomQuery,
  } = useRoomSectionData();
  const myRoomId = myRoomQuery.isSuccess ? (myRoomQuery.data?.id ?? null) : null;
  const roomActions = useRoomSectionActions({
    selectedRoomId: roomSelectionState.selectedRoomId,
    isHostUser: roomMembers.isHostUser,
    myRoomId,
    onRequireLogin,
    setSelectedRoomId: roomSelectionState.setSelectedRoomId,
  });

  useEffect(() => {
    if (!roomSyncRequest) {
      return;
    }

    roomSelectionState.setSelectedRoomId(roomSyncRequest.roomId);
    roomActions.setJoinedRoomId(roomSyncRequest.roomId);
    onRoomSyncHandled();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomSyncRequest, onRoomSyncHandled]);
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
      onRefresh: () => void infiniteRooms.roomsQuery.refetch(),
      isRefreshing: infiniteRooms.roomsQuery.isRefetching,
    },
    list: {
      roomListLoadMoreRef: infiniteRooms.roomListLoadMoreRef,
      roomsQuery: infiniteRooms.roomsQuery,
      rooms: infiniteRooms.rooms,
      selectedRoomId: roomSelectionState.selectedRoomId,
      setSelectedRoomId: roomSelectionState.setSelectedRoomId,
      getRoomCardActionState: roomActions.getRoomCardActionState,
      myRoomId,
      onQuickJoin: roomActions.handleQuickJoin,
      isQuickJoinPending: roomActions.isQuickJoinPending,
    },
    detail: {
      roomDetailQuery: selectedRoomDetailState.roomDetailQuery,
      roomMembersQuery: roomMembers.roomMembersQuery,
      roomMembers: roomMembers.roomMembers,
      currentUserId: roomMembers.currentUserId,
      isHostUser: roomMembers.isHostUser,
      detailDisplay,
      joinedRoomId: roomActions.joinedRoomId,
      isJoinPending: roomActions.isJoinPending,
      onJoin: () => {
        if (roomSelectionState.selectedRoomId === null) {
          return;
        }

        void roomActions.handleJoinRoom(roomSelectionState.selectedRoomId);
      },
      onEdit: () => roomActions.setIsEditRoomModalOpen(true),
      onRequestDelete: () => roomActions.setConfirmTarget({ type: 'delete' }),
      onRequestComplete: () => roomActions.setConfirmTarget({ type: 'complete' }),
      onRequestLeave: () => roomActions.setConfirmTarget({ type: 'leave' }),
      onRequestKick: (userId: number, nickname: string) =>
        roomActions.setConfirmTarget({ type: 'kick', userId, nickname }),
    },
    dialogs: {
      isEditRoomModalOpen: roomActions.isEditRoomModalOpen,
      setIsEditRoomModalOpen: roomActions.setIsEditRoomModalOpen,
      editRoomInitialValues: roomEditTarget.editRoomInitialValues,
      editRoomId: roomEditTarget.editRoomId,
      handleEditRoomSuccess: roomActions.handleEditRoomSuccess,
    },
    confirm: {
      config: deriveRoomConfirmDialogConfig({
        confirmTarget: roomActions.confirmTarget,
        isLeavePending: roomActions.isLeavePending,
        isDeletePending: roomActions.isDeletePending,
        isCompletePending: roomActions.isCompletePending,
        isKickPending: roomActions.isKickPending,
        onConfirmLeave: () => {
          if (roomActions.joinedRoomId === null) {
            return;
          }

          void roomActions.handleLeaveRoom(roomActions.joinedRoomId);
        },
        onConfirmDelete: () => void roomActions.handleDeleteRoom(),
        onConfirmComplete: () => void roomActions.handleCompleteRoom(),
        onConfirmKick: (userId: number) => void roomActions.handleKickMember(userId),
      }),
      errorMessage:
        roomActions.roomActionMessageTone === 'error' ? roomActions.roomActionMessage : '',
      onClose: roomActions.closeConfirmTarget,
    },
    meta,
  };
};
