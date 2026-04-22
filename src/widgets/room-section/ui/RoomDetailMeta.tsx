import { Clock3, MapPin, Users } from 'lucide-react';
import type {
  RoomDetailDisplay,
  RoomDetailQueryState,
} from './RoomDetailPanel.types';

interface RoomDetailMetaProps {
  roomDetailQuery: RoomDetailQueryState;
  detailDisplay: RoomDetailDisplay;
}

const RoomDetailMeta = ({
  roomDetailQuery,
  detailDisplay,
}: RoomDetailMetaProps) => (
  <div className="mt-6 grid gap-3 rounded-[24px] bg-slate-50 p-4 md:grid-cols-3">
    <div className="flex items-center gap-2 text-sm text-slate-600">
      <Users className="h-4 w-4" />
      {detailDisplay.currentCount}/{roomDetailQuery.data?.maxMembersCount ?? 0}명
    </div>
    <div className="flex items-center gap-2 text-sm text-slate-600">
      <MapPin className="h-4 w-4" />
      {roomDetailQuery.data?.place}
    </div>
    <div className="flex items-center gap-2 text-sm text-slate-600">
      <Clock3 className="h-4 w-4" />
      {detailDisplay.formattedLunchAt}
    </div>
  </div>
);

export default RoomDetailMeta;
