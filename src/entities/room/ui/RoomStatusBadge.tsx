import { cn } from '@/shared/lib/classnames';

export type RoomDetailStatus = 'OPEN' | 'FULL' | 'CLOSE';

const roomStatusStyleMap: Record<
  RoomDetailStatus,
  { badgeClassName: string; badgeLabel: string }
> = {
  OPEN: {
    badgeClassName: 'bg-emerald-100 text-emerald-700',
    badgeLabel: '모집중',
  },
  FULL: {
    badgeClassName: 'bg-amber-100 text-amber-700',
    badgeLabel: '정원도달',
  },
  CLOSE: {
    badgeClassName: 'bg-slate-200 text-slate-700',
    badgeLabel: '종료',
  },
};

interface RoomStatusBadgeProps {
  status: RoomDetailStatus;
}

const RoomStatusBadge = ({ status }: RoomStatusBadgeProps) => (
  <span
    className={cn(
      'rounded-full px-3 py-1 text-xs font-semibold',
      roomStatusStyleMap[status].badgeClassName,
    )}
  >
    {roomStatusStyleMap[status].badgeLabel}
  </span>
);

export default RoomStatusBadge;
