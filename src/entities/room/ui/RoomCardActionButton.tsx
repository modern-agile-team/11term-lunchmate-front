import type { MouseEvent } from 'react';
import { cn } from '@/shared/lib/classnames';

interface RoomCardActionButtonProps {
  roomId: number;
  label: string;
  isPending?: boolean;
  disabled?: boolean;
  buttonClassName: string;
  onActionClick: (roomId: number) => void;
}

const RoomCardActionButton = ({
  roomId,
  label,
  isPending = false,
  disabled = false,
  buttonClassName,
  onActionClick,
}: RoomCardActionButtonProps) => {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onActionClick(roomId);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || isPending}
      className={cn(
        'mt-4 w-full rounded-2xl px-4 py-3.5 text-sm font-semibold transition',
        disabled || isPending ? 'cursor-not-allowed opacity-70' : '',
        buttonClassName,
      )}
    >
      {isPending ? '처리 중...' : label}
    </button>
  );
};

export default RoomCardActionButton;
