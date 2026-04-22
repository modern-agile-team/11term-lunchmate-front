import { RoomStatusBadge, RoomTypeBadge } from '@/entities/room';
import type { RoomDetailDisplay, RoomDetailQueryState } from './RoomDetailPanel.types';

interface RoomDetailHeaderProps {
  roomDetailQuery: RoomDetailQueryState;
  isHostUser: boolean;
  detailDisplay: RoomDetailDisplay;
  onEdit: () => void;
  onDelete: () => Promise<void>;
}

const RoomDetailHeader = ({
  roomDetailQuery,
  isHostUser,
  detailDisplay,
  onEdit,
  onDelete,
}: RoomDetailHeaderProps) => (
  <div className="flex flex-wrap items-start justify-between gap-4">
    <div>
      <div className="flex flex-wrap gap-2">
        <RoomTypeBadge roomType={detailDisplay.detailType} />
        <RoomStatusBadge status={detailDisplay.detailStatus} />
      </div>
      <h3 className="mt-4 text-[24px] font-bold tracking-[-0.03em] text-slate-900">
        {roomDetailQuery.data?.title}
      </h3>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-500">
        {roomDetailQuery.data?.description || '방 소개가 아직 없어요.'}
      </p>
    </div>
    {isHostUser ? (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          수정
        </button>
        <button
          type="button"
          onClick={() => void onDelete()}
          className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
        >
          삭제
        </button>
      </div>
    ) : null}
  </div>
);

export default RoomDetailHeader;
