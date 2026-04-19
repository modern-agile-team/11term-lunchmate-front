import { RoomSummary } from '@/entities/room';
import CreateRoomModal from '@/features/room-editor';
import { useRoomSection } from '../model/useRoomSection';
import EmptyRoomState from './EmptyRoomState';
import RoomActionBar from './RoomActionBar';
import RoomDetailPanel from './RoomDetailPanel';
import RoomFilterPanel from './RoomFilterPanel';
import RoomList from './RoomList';

interface RoomSectionProps {
  onRequireLogin: () => void;
}

const RoomSection = ({ onRequireLogin }: RoomSectionProps) => {
  const {
    roomListLoadMoreRef,
    roomFilterState,
    setRoomFilterState,
    roomsQuery,
    rooms,
    roomActionMessage,
    roomActionMessageTone,
    selectedRoomId,
    setSelectedRoomId,
    roomDetailQuery,
    roomMembersQuery,
    roomMembers,
    currentUserId,
    isHostUser,
    isEditRoomModalOpen,
    setIsEditRoomModalOpen,
    handleKickMember,
    handleDeleteRoom,
    getRoomCardActionState,
    editRoomInitialValues,
    editRoomId,
    handleEditRoomSuccess,
    formatLunchAt,
    getDetailRoomCurrentCount,
    toDetailRoomType,
    toDetailRoomStatus,
  } = useRoomSection({ onRequireLogin });
  const isRoomListReady = !roomsQuery.isLoading && !roomsQuery.isError;
  const shouldShowDetail = selectedRoomId !== null && isRoomListReady;
  const shouldShowEditModal = Boolean(editRoomId && editRoomInitialValues);
  const detailDisplay =
    roomDetailQuery.data !== undefined
      ? {
          detailType: toDetailRoomType(roomDetailQuery.data.roomType),
          detailStatus: toDetailRoomStatus(roomDetailQuery.data.status),
          formattedLunchAt: formatLunchAt(roomDetailQuery.data.lunchAt),
          currentCount: getDetailRoomCurrentCount(roomDetailQuery.data),
        }
      : null;

  return (
    <section className="space-y-4 md:space-y-5">
      <RoomFilterPanel
        roomFilterState={roomFilterState}
        setRoomFilterState={setRoomFilterState}
      />

      {isRoomListReady ? <RoomSummary roomCount={rooms.length} /> : null}
      <RoomActionBar message={roomActionMessage} tone={roomActionMessageTone} />

      <EmptyRoomState
        isLoading={roomsQuery.isLoading}
        isError={roomsQuery.isError}
        error={roomsQuery.error}
        roomCount={rooms.length}
      />

      {isRoomListReady ? (
        <RoomList
          rooms={rooms}
          roomsQuery={roomsQuery}
          selectedRoomId={selectedRoomId}
          setSelectedRoomId={setSelectedRoomId}
          getRoomCardActionState={getRoomCardActionState}
          roomListLoadMoreRef={roomListLoadMoreRef}
        />
      ) : null}

      {shouldShowDetail ? (
        <RoomDetailPanel
          detailState={{
            roomDetailQuery,
            isHostUser,
          }}
          memberState={{
            roomMembersQuery,
            roomMembers,
            currentUserId,
          }}
          actions={{
            openEditModal: () => setIsEditRoomModalOpen(true),
            deleteRoom: handleDeleteRoom,
            kickMember: handleKickMember,
          }}
          display={detailDisplay}
        />
      ) : null}

      {shouldShowEditModal ? (
        <CreateRoomModal
          isOpen={isEditRoomModalOpen}
          onClose={() => setIsEditRoomModalOpen(false)}
          onRequireLogin={onRequireLogin}
          mode="edit"
          roomId={editRoomId!}
          initialValues={editRoomInitialValues!}
          onSuccess={handleEditRoomSuccess}
        />
      ) : null}
    </section>
  );
};

export default RoomSection;
