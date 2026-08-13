import { RoomStatusBadge, RoomTypeBadge } from '@/entities/room';
import type { RoomDetailDisplay, RoomDetailQueryState } from './RoomDetailPanel.types';

interface RoomDetailHeaderProps {
  roomDetailQuery: RoomDetailQueryState;
  detailDisplay: RoomDetailDisplay;
}

const RoomDetailHeader = ({ roomDetailQuery, detailDisplay }: RoomDetailHeaderProps) => (
  <div>
    <div className="flex flex-wrap gap-2">
      <RoomTypeBadge roomType={detailDisplay.detailType} />
      <RoomStatusBadge status={detailDisplay.detailStatus} />
    </div>
    <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-500">
      {roomDetailQuery.data?.description || '방 소개가 아직 없어요.'}
    </p>
  </div>
);

export default RoomDetailHeader;
