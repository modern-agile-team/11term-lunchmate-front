import { cn } from '@/shared/lib/classnames';
import type { MainRoom } from '../model/mainRoom';

const roomTypeStyleMap: Record<
  MainRoom['roomType'],
  { badgeClassName: string; badgeLabel: string }
> = {
  MALE: {
    badgeClassName: 'bg-sky-100 text-sky-700',
    badgeLabel: '남성만',
  },
  FEMALE: {
    badgeClassName: 'bg-rose-100 text-rose-700',
    badgeLabel: '여성만',
  },
  MIXED: {
    badgeClassName: 'bg-indigo-100 text-indigo-700',
    badgeLabel: '혼성',
  },
};

interface RoomTypeBadgeProps {
  roomType: MainRoom['roomType'];
}

const RoomTypeBadge = ({ roomType }: RoomTypeBadgeProps) => (
  <span
    className={cn(
      'rounded-full px-3 py-1 text-xs font-semibold',
      roomTypeStyleMap[roomType].badgeClassName,
    )}
  >
    {roomTypeStyleMap[roomType].badgeLabel}
  </span>
);

export default RoomTypeBadge;
