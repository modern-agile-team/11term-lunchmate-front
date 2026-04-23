import type { RefObject } from 'react';
import type { MainRoom } from '@/entities/room';
import SelectableRoomCard from './SelectableRoomCard';

interface RoomCardActionState {
  isActionPending: boolean;
  actionDisabled: boolean;
  actionLabel: string;
  onActionClick: (roomId: number) => void;
}

interface RoomListQueryState {
  isFetchingNextPage: boolean;
  hasNextPage: boolean | undefined;
  isFetchNextPageError: boolean;
}

interface RoomListProps {
  rooms: MainRoom[];
  roomsQuery: RoomListQueryState;
  selectedRoomId: number | null;
  setSelectedRoomId: (roomId: number) => void;
  getRoomCardActionState: (room: MainRoom) => RoomCardActionState;
  roomListLoadMoreRef: RefObject<HTMLDivElement | null>;
}

const RoomList = ({
  rooms,
  roomsQuery,
  selectedRoomId,
  setSelectedRoomId,
  getRoomCardActionState,
  roomListLoadMoreRef,
}: RoomListProps) => {
  if (rooms.length === 0) return null;

  return (
    <>
      {rooms.map((room) => (
        <SelectableRoomCard
          key={room.id}
          room={room}
          selectedRoomId={selectedRoomId}
          setSelectedRoomId={setSelectedRoomId}
          roomCardActionState={getRoomCardActionState(room)}
        />
      ))}

      <div className="space-y-3">
        {roomsQuery.isFetchingNextPage ? (
          <section className="rounded-[24px] border border-slate-200/80 bg-white px-5 py-4 text-center text-sm text-slate-500 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
            점심 방을 더 불러오는 중...
          </section>
        ) : null}
        {!roomsQuery.hasNextPage ? (
          <section className="rounded-[24px] border border-slate-200/80 bg-white px-5 py-4 text-center text-sm text-slate-500 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
            마지막 방까지 모두 확인했어요.
          </section>
        ) : null}
        {roomsQuery.isFetchNextPageError ? (
          <section className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-center text-sm text-rose-600 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
            점심 방을 더 불러오지 못했어요.
          </section>
        ) : null}
        <div ref={roomListLoadMoreRef} className="h-1 w-full" aria-hidden="true" />
      </div>
    </>
  );
};

export default RoomList;
