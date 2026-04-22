import { RoomSummary } from '@/entities/room';
import RoomEditorModal from '@/features/room/editor';
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
  const { filter, list, detail, dialogs, meta } = useRoomSection({ onRequireLogin });

  return (
    <section className="space-y-4 md:space-y-5">
      <RoomFilterPanel roomFilterState={filter.roomFilterState} setRoomFilterState={filter.setRoomFilterState} />

      {meta.isRoomListReady ? <RoomSummary roomCount={list.rooms.length} /> : null}
      <RoomActionBar message={meta.roomActionMessage} tone={meta.roomActionMessageTone} />

      <EmptyRoomState
        isLoading={list.roomsQuery.isLoading}
        isError={list.roomsQuery.isError}
        error={list.roomsQuery.error}
        roomCount={list.rooms.length}
      />

      {meta.isRoomListReady ? (
        <RoomList
          rooms={list.rooms}
          roomsQuery={list.roomsQuery}
          selectedRoomId={list.selectedRoomId}
          setSelectedRoomId={list.setSelectedRoomId}
          getRoomCardActionState={list.getRoomCardActionState}
          roomListLoadMoreRef={list.roomListLoadMoreRef}
        />
      ) : null}

      {meta.shouldShowDetail ? (
        <RoomDetailPanel
          roomDetailQuery={detail.roomDetailQuery}
          roomMembersQuery={detail.roomMembersQuery}
          roomMembers={detail.roomMembers}
          currentUserId={detail.currentUserId}
          isHostUser={detail.isHostUser}
          detailDisplay={detail.detailDisplay}
          onEdit={detail.onEdit}
          onDelete={detail.onDelete}
          onKickMember={detail.onKickMember}
        />
      ) : null}

      {meta.shouldShowEditModal ? (
        <RoomEditorModal
          isOpen={dialogs.isEditRoomModalOpen}
          onClose={() => dialogs.setIsEditRoomModalOpen(false)}
          onRequireLogin={onRequireLogin}
          mode="edit"
          roomId={dialogs.editRoomId!}
          initialValues={dialogs.editRoomInitialValues!}
          onSuccess={dialogs.handleEditRoomSuccess}
        />
      ) : null}
    </section>
  );
};

export default RoomSection;
