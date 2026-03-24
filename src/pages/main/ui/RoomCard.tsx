import { Clock3, MapPin, Users } from 'lucide-react';

import type { MainRoom } from '../model/types';

interface RoomCardProps {
  room: MainRoom;
}

const roomTypeStyleMap = {
  MALE: {
    accentClassName: 'bg-blue-500',
    badgeLabel: '남성만',
  },
  FEMALE: {
    accentClassName: 'bg-pink-500',
    badgeLabel: '여성만',
  },
  MIXED: {
    accentClassName: 'bg-indigo-500',
    badgeLabel: '혼성',
  },
} as const;

const RoomCard = ({ room }: RoomCardProps) => {
  const { accentClassName, badgeLabel } = roomTypeStyleMap[room.roomType];
  const progressPercent = (room.currentCount / room.capacity) * 100;
  const remainingCount = room.capacity - room.currentCount;

  return (
    <article className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
      <div className="flex gap-4 p-5 md:p-6">
        <div className={`w-[5px] rounded-full ${accentClassName}`} />

        <div className="min-w-0 flex-1">
          <h2 className="text-[19px] font-bold tracking-[-0.03em] text-slate-900">{room.title}</h2>

          <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
            <span className="rounded-md bg-slate-100 px-2 py-1 font-medium text-slate-600">
              {badgeLabel}
            </span>
            <span className="rounded-md bg-slate-100 px-2 py-1 font-medium text-slate-600">
              {room.minAge}-{room.maxAge}대
            </span>
          </div>

          <div className="mt-4 space-y-2.5 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="font-semibold text-slate-700">
                {room.currentCount}/{room.capacity}명
              </span>
              <span>({remainingCount}명 모집중)</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{room.place}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock3 className="h-4 w-4" />
              <span>{room.lunchAt}</span>
            </div>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${accentClassName}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <button
            type="button"
            className="mt-4 w-full rounded-2xl bg-slate-100 px-4 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            참여하기
          </button>
        </div>
      </div>
    </article>
  );
};

export default RoomCard;
