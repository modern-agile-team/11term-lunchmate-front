import RoomDetailHeader from './RoomDetailHeader';
import RoomDetailMeta from './RoomDetailMeta';
import RoomMemberSection from './RoomMemberSection';
import type { RoomDetailPanelProps } from './RoomDetailPanel.types';

const RoomDetailPanel = ({
  detailState,
  memberState,
  actions,
  detailDisplay,
}: RoomDetailPanelProps) => (
  <article className="rounded-[32px] border border-slate-200/80 bg-white px-6 py-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] md:px-7">
    {detailState.roomDetailQuery.isLoading ? (
      <div className="rounded-[24px] bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
        방 상세 정보를 불러오는 중...
      </div>
    ) : null}
    {detailState.roomDetailQuery.isError ? (
      <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-10 text-center text-sm text-rose-600">
        방 상세 정보를 불러오지 못했어요.
        {detailState.roomDetailQuery.error instanceof Error
          ? ` ${detailState.roomDetailQuery.error.message}`
          : ''}
      </div>
    ) : null}
    {detailState.roomDetailQuery.data &&
    detailDisplay &&
    !detailState.roomDetailQuery.isLoading &&
    !detailState.roomDetailQuery.isError ? (
      <>
        <RoomDetailHeader
          roomDetailQuery={detailState.roomDetailQuery}
          isHostUser={detailState.isHostUser}
          detailDisplay={detailDisplay}
          onEdit={actions.openEditModal}
          onDelete={actions.deleteRoom}
        />
        <RoomDetailMeta
          roomDetailQuery={detailState.roomDetailQuery}
          detailDisplay={detailDisplay}
        />
        <RoomMemberSection
          roomMembersQuery={memberState.roomMembersQuery}
          roomMembers={memberState.roomMembers}
          isHostUser={detailState.isHostUser}
          currentUserId={memberState.currentUserId}
          onKickMember={actions.kickMember}
        />
      </>
    ) : null}
  </article>
);

export default RoomDetailPanel;
