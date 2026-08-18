import { cn } from '@/shared/lib/classnames';
import type { MainRoom } from '../model/mainRoom';
import RoomCardActionButton from './RoomCardActionButton';
import RoomCardCapacity from './RoomCardCapacity';
import RoomCardContent from './RoomCardContent';
import { roomTypeStyleMap } from './roomCard.styles';

interface RoomCardProps {
  room: MainRoom;
  isSelected: boolean;
  onClick: () => void;
  onActionClick: (roomId: number) => void;
  isActionPending?: boolean;
  isInactive?: boolean;
  actionDisabled?: boolean;
  actionLabel?: string;
}

const RoomCard = ({
  room,
  isSelected,
  onClick,
  onActionClick,
  isActionPending = false,
  isInactive = false,
  actionDisabled = false,
  actionLabel = '참여하기',
}: RoomCardProps) => {
  const { badgeClassName, badgeLabel, buttonClassName, cardClassName, progressClassName } =
    roomTypeStyleMap[room.roomType];
  const isCompleted = room.status === 'COMPLETE';
  const inactiveButtonClassName = isCompleted
    ? 'bg-sky-100 text-sky-700'
    : 'bg-slate-200 text-slate-500';
  const inactiveProgressClassName = isCompleted ? 'bg-sky-300' : 'bg-slate-300';

  return (
    <article
      onClick={onClick}
      className={cn(
        'cursor-pointer overflow-hidden rounded-[28px] border shadow-[0_12px_30px_rgba(15,23,42,0.05)] transition',
        cardClassName,
        isSelected ? 'ring-4 ring-slate-900/10' : 'hover:-translate-y-0.5',
      )}
    >
      <div className="p-5 md:p-6">
        <div className="min-w-0">
          <RoomCardContent
            room={room}
            badgeClassName={badgeClassName}
            badgeLabel={badgeLabel}
          />
          <RoomCardCapacity
            room={room}
            progressClassName={isInactive ? inactiveProgressClassName : progressClassName}
          />
          <RoomCardActionButton
            roomId={room.id}
            label={actionLabel}
            isPending={isActionPending}
            isInactive={isInactive}
            disabled={actionDisabled}
            buttonClassName={isInactive ? inactiveButtonClassName : buttonClassName}
            onActionClick={onActionClick}
          />
        </div>
      </div>
    </article>
  );
};

export default RoomCard;
