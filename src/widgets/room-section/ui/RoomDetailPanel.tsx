import RoomDetailError from './RoomDetailError';
import RoomDetailHeader from './RoomDetailHeader';
import RoomDetailLoading from './RoomDetailLoading';
import RoomDetailMeta from './RoomDetailMeta';
import RoomMemberSection from './RoomMemberSection';
import type { RoomDetailPanelProps } from './RoomDetailPanel.types';

const RoomDetailPanel = ({
  roomDetailQuery,
  roomMembersQuery,
  roomMembers,
  currentUserId,
  isHostUser,
  detailDisplay,
  onEdit,
  onDelete,
  onKickMember,
}: RoomDetailPanelProps) => (
  <article className="rounded-[32px] border border-slate-200/80 bg-white px-6 py-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] md:px-7">
    {roomDetailQuery.isLoading ? <RoomDetailLoading /> : null}
    {roomDetailQuery.isError ? (
      <RoomDetailError error={roomDetailQuery.error} />
    ) : null}
    {roomDetailQuery.data &&
    detailDisplay &&
    !roomDetailQuery.isLoading &&
    !roomDetailQuery.isError ? (
      <>
        <RoomDetailHeader
          roomDetailQuery={roomDetailQuery}
          isHostUser={isHostUser}
          detailDisplay={detailDisplay}
          onEdit={onEdit}
          onDelete={onDelete}
        />
        <RoomDetailMeta roomDetailQuery={roomDetailQuery} detailDisplay={detailDisplay} />
        <RoomMemberSection
          roomMembersQuery={roomMembersQuery}
          roomMembers={roomMembers}
          isHostUser={isHostUser}
          currentUserId={currentUserId}
          onKickMember={onKickMember}
        />
      </>
    ) : null}
  </article>
);

export default RoomDetailPanel;
