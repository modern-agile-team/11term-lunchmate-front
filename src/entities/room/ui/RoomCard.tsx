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
  actionDisabled?: boolean;
  actionLabel?: string;
}

const RoomCard = ({
  room,
  isSelected,
  onClick,
  onActionClick,
  isActionPending = false,
  actionDisabled = false,
  actionLabel = '참여하기',
}: RoomCardProps) => {
  const { badgeClassName, badgeLabel, buttonClassName, cardClassName, progressClassName } =
    roomTypeStyleMap[room.roomType];

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
          <RoomCardCapacity room={room} progressClassName={progressClassName} />
          <RoomCardActionButton
            roomId={room.id}
            label={actionLabel}
            isPending={isActionPending}
            disabled={actionDisabled}
            buttonClassName={buttonClassName}
            onActionClick={onActionClick}
          />
        </div>
      </div>
    </article>
  );
};

export default RoomCard;
