import type { RoomSyncRequest } from '@/entities/room';
import { RoomSummary } from '@/entities/room';
import RoomEditorModal from '@/features/room/editor';
import AppDialog from '@/shared/ui/modal/AppDialog';
import ConfirmDialog from '@/shared/ui/modal/ConfirmDialog';
import { useRoomSection } from '../model/useRoomSection';
import EmptyRoomState from './EmptyRoomState';
import RoomActionBar from './RoomActionBar';
import RoomDetailPanel from './RoomDetailPanel';
import RoomFilterPanel from './RoomFilterPanel';
import RoomList from './RoomList';
import RoomQuickJoinBar from './RoomQuickJoinBar';

interface RoomSectionProps {
  onRequireLogin: () => void;
  roomSyncRequest: RoomSyncRequest | null;
  onRoomSyncHandled: () => void;
}

const RoomSection = ({ onRequireLogin, roomSyncRequest, onRoomSyncHandled }: RoomSectionProps) => {
  const { filter, list, detail, dialogs, confirm, meta } = useRoomSection({
    onRequireLogin,
    roomSyncRequest,
    onRoomSyncHandled,
  });

  return (
    <section className="space-y-4 md:space-y-5">
      <RoomFilterPanel
        roomFilterState={filter.roomFilterState}
        setRoomFilterState={filter.setRoomFilterState}
        onRefresh={filter.onRefresh}
        isRefreshing={filter.isRefreshing}
      />

      {meta.isRoomListReady ? <RoomSummary roomCount={list.rooms.length} /> : null}
      <RoomQuickJoinBar
        myRoomId={list.myRoomId}
        isQuickJoinPending={list.isQuickJoinPending}
        onQuickJoin={list.onQuickJoin}
        onViewMyRoom={list.setSelectedRoomId}
      />
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

      <AppDialog
        isOpen={meta.shouldShowDetail}
        onClose={() => list.setSelectedRoomId(null)}
        title={detail.roomDetailQuery.data?.title ?? '점심 방 상세'}
        maxWidthClassName="max-w-2xl"
      >
        <RoomDetailPanel
          roomDetailQuery={detail.roomDetailQuery}
          roomMembersQuery={detail.roomMembersQuery}
          roomMembers={detail.roomMembers}
          currentUserId={detail.currentUserId}
          isHostUser={detail.isHostUser}
          detailDisplay={detail.detailDisplay}
          joinedRoomId={detail.joinedRoomId}
          isJoinPending={detail.isJoinPending}
          onJoin={detail.onJoin}
          onEdit={detail.onEdit}
          onRequestDelete={detail.onRequestDelete}
          onRequestKick={detail.onRequestKick}
          onRequestComplete={detail.onRequestComplete}
          onRequestLeave={detail.onRequestLeave}
        />
      </AppDialog>

      <ConfirmDialog
        isOpen={confirm.config !== null}
        tone={confirm.config?.tone}
        eyebrow={confirm.config?.eyebrow ?? ''}
        title={confirm.config?.title ?? ''}
        description={confirm.config?.description ?? ''}
        confirmLabel={confirm.config?.confirmLabel ?? ''}
        pendingLabel={confirm.config?.pendingLabel}
        isPending={confirm.config?.isPending ?? false}
        errorMessage={confirm.errorMessage}
        onClose={confirm.onClose}
        onConfirm={() => confirm.config?.onConfirm()}
      />

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
