import { Users } from 'lucide-react';
import { cn } from '@/shared/lib/classnames';
import type { MainRoom } from '../model/mainRoom';

interface RoomCardCapacityProps {
  room: MainRoom;
  progressClassName: string;
}

const RoomCardCapacity = ({ room, progressClassName }: RoomCardCapacityProps) => {
  const progressPercent = (room.currentCount / room.capacity) * 100;
  const remainingCount = room.capacity - room.currentCount;

  return (
    <>
      <div className="mt-4 space-y-2.5 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span className="font-semibold text-slate-700">
            {room.currentCount}/{room.capacity}명
          </span>
          <span>({remainingCount}명 모집중)</span>
        </div>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={cn('h-full rounded-full', progressClassName)}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </>
  );
};

export default RoomCardCapacity;
