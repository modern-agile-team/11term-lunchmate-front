import { Clock3, MapPin, Users } from 'lucide-react';

import type { MainRoom } from '../model/types';

interface RoomCardProps {
  room: MainRoom;
}

const roomTypeStyleMap = {
  MALE: {
    badgeClassName: 'bg-sky-100 text-sky-700',
    badgeLabel: '남성만',
    cardClassName: 'border-sky-100 bg-sky-50/50',
    progressClassName: 'bg-sky-500',
    buttonClassName:
      'bg-sky-500 text-white hover:bg-sky-600 shadow-[0_10px_24px_rgba(14,165,233,0.2)]',
  },
  FEMALE: {
    badgeClassName: 'bg-rose-100 text-rose-700',
    badgeLabel: '여성만',
    cardClassName: 'border-rose-100 bg-rose-50/50',
    progressClassName: 'bg-rose-500',
    buttonClassName:
      'bg-rose-500 text-white hover:bg-rose-600 shadow-[0_10px_24px_rgba(244,63,94,0.18)]',
  },
  MIXED: {
    badgeClassName: 'bg-indigo-100 text-indigo-700',
    badgeLabel: '혼성',
    cardClassName: 'border-indigo-100 bg-indigo-50/50',
    progressClassName: 'bg-indigo-500',
    buttonClassName:
      'bg-indigo-500 text-white hover:bg-indigo-600 shadow-[0_10px_24px_rgba(99,102,241,0.22)]',
  },
} as const;

const RoomCard = ({ room }: RoomCardProps) => {
  const { badgeClassName, badgeLabel, buttonClassName, cardClassName, progressClassName } =
    roomTypeStyleMap[room.roomType];
  const progressPercent = (room.currentCount / room.capacity) * 100;
  const remainingCount = room.capacity - room.currentCount;

  return (
    <article
      className={[
        'overflow-hidden rounded-[28px] border shadow-[0_12px_30px_rgba(15,23,42,0.05)]',
        cardClassName,
      ].join(' ')}
    >
      <div className="p-5 md:p-6">
        <div className="min-w-0">
          <h2 className="text-[19px] font-bold tracking-[-0.03em] text-slate-900">{room.title}</h2>

          <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
            <span className={['rounded-md px-2 py-1 font-medium', badgeClassName].join(' ')}>
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
              className={['h-full rounded-full', progressClassName].join(' ')}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <button
            type="button"
            className={[
              'mt-4 w-full rounded-2xl px-4 py-3.5 text-sm font-semibold transition',
              buttonClassName,
            ].join(' ')}
          >
            참여하기
          </button>
        </div>
      </div>
    </article>
  );
};

export default RoomCard;
