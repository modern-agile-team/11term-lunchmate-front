import { RoomCard as EntityRoomCard, type MainRoom } from '@/entities/room';

interface RoomCardActionState {
  isActionPending: boolean;
  actionDisabled: boolean;
  actionLabel: string;
  onActionClick: (roomId: number) => void;
}

interface RoomCardProps {
  room: MainRoom;
  selectedRoomId: number | null;
  setSelectedRoomId: (roomId: number) => void;
  roomCardActionState: RoomCardActionState;
}

const RoomCard = ({
  room,
  selectedRoomId,
  setSelectedRoomId,
  roomCardActionState,
}: RoomCardProps) => (
  <EntityRoomCard
    room={room}
    isSelected={selectedRoomId === room.id}
    onClick={() => setSelectedRoomId(room.id)}
    onActionClick={roomCardActionState.onActionClick}
    isActionPending={roomCardActionState.isActionPending}
    actionDisabled={roomCardActionState.actionDisabled}
    actionLabel={roomCardActionState.actionLabel}
  />
);

export default RoomCard;
