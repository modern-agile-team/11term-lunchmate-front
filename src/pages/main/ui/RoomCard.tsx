import { Clock3, MapPin, Users } from 'lucide-react';

import type { Room } from '@/entities/room/model/types';

interface RoomCardProps {
  room: Room;
}

const accentColorClassNameMap = {
  blue: 'bg-blue-500',
  indigo: 'bg-indigo-500',
  pink: 'bg-pink-500',
} as const;

const RoomCard = ({ room }: RoomCardProps) => {
  const progress = (room.currentCount / room.maxCount) * 100;
  const accentColorClassName = accentColorClassNameMap[room.accentColor];

  return (
    <article className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
      <div className="flex items-start gap-3 p-5">
        <div className={`h-full w-1.5 self-stretch rounded-full ${accentColorClassName}`} />
        <div className="flex-1">
          <h3 className="text-base font-semibold text-slate-900">{room.title}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="rounded-md bg-slate-100 px-2 py-1 font-medium text-slate-600">
              {room.badge}
            </span>
            <span className="rounded-md bg-slate-100 px-2 py-1 font-medium text-slate-600">
              {room.ageRange}
            </span>
          </div>

          <div className="mt-4 space-y-2 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="font-semibold text-slate-700">
                {room.currentCount}/{room.maxCount}명
              </span>
              <span>({room.recruitingText})</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{room.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock3 className="h-4 w-4" />
              <span>{room.time}</span>
            </div>
          </div>

          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${accentColorClassName}`}
              style={{ width: `${progress}%` }}
            />
          </div>

          <button
            type="button"
            className="mt-4 w-full rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            참여하기
          </button>
        </div>
      </div>
    </article>
  );
};

export default RoomCard;
