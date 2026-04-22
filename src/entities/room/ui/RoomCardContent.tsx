import { Clock3, MapPin } from 'lucide-react';
import { cn } from '@/shared/lib/classnames';
import type { MainRoom } from '../model/mainRoom';

interface RoomCardContentProps {
  room: MainRoom;
  badgeClassName: string;
  badgeLabel: string;
}

const RoomCardContent = ({
  room,
  badgeClassName,
  badgeLabel,
}: RoomCardContentProps) => (
  <div className="min-w-0">
    <h2 className="text-[19px] font-bold tracking-[-0.03em] text-slate-900">{room.title}</h2>

    <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
      <span className={cn('rounded-md px-2 py-1 font-medium', badgeClassName)}>{badgeLabel}</span>
      <span className="rounded-md bg-slate-100 px-2 py-1 font-medium text-slate-600">
        {room.minAge}-{room.maxAge}대
      </span>
    </div>

    <div className="mt-4 space-y-2.5 text-sm text-slate-500">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        <span>{room.place}</span>
      </div>

      <div className="flex items-center gap-2">
        <Clock3 className="h-4 w-4" />
        <span>{room.lunchAt}</span>
      </div>
    </div>
  </div>
);

export default RoomCardContent;
