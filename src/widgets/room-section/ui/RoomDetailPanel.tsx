import { PencilLine, Trash2 } from 'lucide-react';
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
  <div>
    {roomDetailQuery.isLoading ? <RoomDetailLoading /> : null}
    {roomDetailQuery.isError ? <RoomDetailError error={roomDetailQuery.error} /> : null}
    {roomDetailQuery.data &&
    detailDisplay &&
    !roomDetailQuery.isLoading &&
    !roomDetailQuery.isError ? (
      <>
        <RoomDetailHeader roomDetailQuery={roomDetailQuery} detailDisplay={detailDisplay} />
        <RoomDetailMeta roomDetailQuery={roomDetailQuery} detailDisplay={detailDisplay} />
        <RoomMemberSection
          roomMembersQuery={roomMembersQuery}
          roomMembers={roomMembers}
          isHostUser={isHostUser}
          currentUserId={currentUserId}
          onKickMember={onKickMember}
        />

        {isHostUser ? (
          <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <PencilLine className="h-4 w-4" />
              수정
            </button>
            <button
              type="button"
              onClick={() => void onDelete()}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-rose-500 px-5 text-sm font-semibold text-white transition hover:bg-rose-600"
            >
              <Trash2 className="h-4 w-4" />
              삭제
            </button>
          </div>
        ) : null}
      </>
    ) : null}
  </div>
);

export default RoomDetailPanel;
