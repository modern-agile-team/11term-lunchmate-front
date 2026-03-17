import type { Room } from '../../../entities/room/model/types';
import RoomCard from '../../../shared/ui/room-card/RoomCard';

interface RoomListProps {
  rooms: Room[];
}

const RoomList = ({ rooms }: RoomListProps) => {
  return (
    <section className="space-y-4">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </section>
  );
};

export default RoomList;
