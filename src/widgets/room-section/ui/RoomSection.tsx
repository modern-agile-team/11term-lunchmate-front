import { Clock3, MapPin, Users } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { RoomCard, RoomSummary } from '@/entities/room';
import CreateRoomModal from '@/features/room-editor';
import {
  detailRoomStatusStyleMap,
  detailRoomTypeStyleMap,
  roomStatusFilterOptions,
  roomTypeFilterOptions,
} from '../model/constants';
import { useRoomSection } from '../model/useRoomSection';

interface RoomSectionProps {
  onRequireLogin: () => void;
}

const RoomSection = ({ onRequireLogin }: RoomSectionProps) => {
  const {
    roomListLoadMoreRef,
    roomFilterState,
    setRoomFilterState,
    roomsQuery,
    rooms,
    roomActionMessage,
    roomActionMessageTone,
    selectedRoomId,
    setSelectedRoomId,
    roomDetailQuery,
    roomMembersQuery,
    roomMembers,
    currentUserId,
    isHostUser,
    isEditRoomModalOpen,
    setIsEditRoomModalOpen,
    handleKickMember,
    handleDeleteRoom,
    getRoomCardActionState,
    editRoomInitialValues,
    editRoomId,
    handleEditRoomSuccess,
    formatLunchAt,
    getDetailRoomCurrentCount,
    toDetailRoomType,
    toDetailRoomStatus,
  } = useRoomSection({ onRequireLogin });

  return (
    <section className="space-y-4 md:space-y-5">
      <section className="rounded-[28px] border border-slate-200/80 bg-white px-5 py-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] md:px-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-slate-700">방 구분</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {roomTypeFilterOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setRoomFilterState((current) => ({ ...current, roomType: option.value }))}
                  className={cn(
                    'rounded-2xl px-4 py-2.5 text-sm font-semibold transition',
                    roomFilterState.roomType === option.value
                      ? 'bg-slate-900 text-white'
                      : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-700">모집 상태</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {roomStatusFilterOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setRoomFilterState((current) => ({ ...current, status: option.value }))}
                  className={cn(
                    'rounded-2xl px-4 py-2.5 text-sm font-semibold transition',
                    roomFilterState.status === option.value
                      ? 'bg-slate-900 text-white'
                      : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">최소 나이</span>
              <input
                type="number"
                min="0"
                value={roomFilterState.minAge}
                onChange={(event) => setRoomFilterState((current) => ({ ...current, minAge: event.target.value }))}
                placeholder="예: 20"
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">최대 나이</span>
              <input
                type="number"
                min="0"
                value={roomFilterState.maxAge}
                onChange={(event) => setRoomFilterState((current) => ({ ...current, maxAge: event.target.value }))}
                placeholder="예: 24"
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              />
            </label>
          </div>
        </div>
      </section>

      {!roomsQuery.isLoading && !roomsQuery.isError ? <RoomSummary roomCount={rooms.length} /> : null}
      {roomActionMessage ? (
        <section
          className={cn(
            'rounded-[24px] border px-5 py-4 text-sm shadow-[0_12px_30px_rgba(15,23,42,0.05)]',
            roomActionMessageTone === 'error'
              ? 'border-rose-200 bg-rose-50 text-rose-600'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700',
          )}
        >
          {roomActionMessage}
        </section>
      ) : null}

      {roomsQuery.isLoading ? (
        <section className="rounded-[28px] border border-slate-200/80 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
          점심 방을 불러오는 중...
        </section>
      ) : null}
      {roomsQuery.isError ? (
        <section className="rounded-[28px] border border-rose-200 bg-rose-50 px-6 py-10 text-center text-sm text-rose-600 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
          점심 방을 불러오지 못했어요.
          {roomsQuery.error instanceof Error ? ` ${roomsQuery.error.message}` : ''}
        </section>
      ) : null}
      {!roomsQuery.isLoading && !roomsQuery.isError && rooms.length === 0 ? (
        <section className="rounded-[28px] border border-slate-200/80 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
          아직 열려 있는 점심 방이 없어요.
        </section>
      ) : null}

      {!roomsQuery.isLoading && !roomsQuery.isError
        ? rooms.map((room) => {
            const roomCardActionState = getRoomCardActionState(room);

            return (
              <RoomCard
                key={room.id}
                room={room}
                isSelected={selectedRoomId === room.id}
                onClick={() => setSelectedRoomId(room.id)}
                onActionClick={roomCardActionState.onActionClick}
                isActionPending={roomCardActionState.isActionPending}
                actionDisabled={roomCardActionState.actionDisabled}
                actionLabel={roomCardActionState.actionLabel}
              />
            );
          })
        : null}

      {!roomsQuery.isLoading && !roomsQuery.isError && rooms.length > 0 ? (
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
      ) : null}

      {selectedRoomId !== null && !roomsQuery.isLoading && !roomsQuery.isError ? (
        <article className="rounded-[32px] border border-slate-200/80 bg-white px-6 py-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] md:px-7">
          {roomDetailQuery.isLoading ? (
            <div className="rounded-[24px] bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
              방 상세 정보를 불러오는 중...
            </div>
          ) : null}
          {roomDetailQuery.isError ? (
            <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-10 text-center text-sm text-rose-600">
              방 상세 정보를 불러오지 못했어요.
              {roomDetailQuery.error instanceof Error ? ` ${roomDetailQuery.error.message}` : ''}
            </div>
          ) : null}
          {roomDetailQuery.data && !roomDetailQuery.isLoading && !roomDetailQuery.isError ? (
            <>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={cn(
                        'rounded-full px-3 py-1 text-xs font-semibold',
                        detailRoomTypeStyleMap[toDetailRoomType(roomDetailQuery.data.roomType)].badgeClassName,
                      )}
                    >
                      {detailRoomTypeStyleMap[toDetailRoomType(roomDetailQuery.data.roomType)].badgeLabel}
                    </span>
                    <span
                      className={cn(
                        'rounded-full px-3 py-1 text-xs font-semibold',
                        detailRoomStatusStyleMap[toDetailRoomStatus(roomDetailQuery.data.status)].badgeClassName,
                      )}
                    >
                      {detailRoomStatusStyleMap[toDetailRoomStatus(roomDetailQuery.data.status)].badgeLabel}
                    </span>
                  </div>
                  <h3 className="mt-4 text-[24px] font-bold tracking-[-0.03em] text-slate-900">
                    {roomDetailQuery.data.title}
                  </h3>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-500">
                    {roomDetailQuery.data.description || '방 소개가 아직 없어요.'}
                  </p>
                </div>
                {isHostUser ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditRoomModalOpen(true)}
                      className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        void handleDeleteRoom();
                      }}
                      className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
                    >
                      삭제
                    </button>
                  </div>
                ) : null}
              </div>

              <div className="mt-6 grid gap-3 rounded-[24px] bg-slate-50 p-4 md:grid-cols-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Users className="h-4 w-4" />
                  {getDetailRoomCurrentCount(roomDetailQuery.data)}/{roomDetailQuery.data.maxMembersCount}명
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="h-4 w-4" />
                  {roomDetailQuery.data.place}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock3 className="h-4 w-4" />
                  {formatLunchAt(roomDetailQuery.data.lunchAt)}
                </div>
              </div>

              <section className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-800">참여 멤버</h4>
                  <span className="text-xs text-slate-400">{roomMembers.length}명</span>
                </div>
                {roomMembersQuery.isLoading ? (
                  <div className="rounded-2xl bg-slate-50 px-4 py-5 text-sm text-slate-500">
                    멤버 목록을 불러오는 중...
                  </div>
                ) : null}
                {roomMembersQuery.isError ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-5 text-sm text-rose-600">
                    멤버 목록을 불러오지 못했어요.
                  </div>
                ) : null}
                {!roomMembersQuery.isLoading && !roomMembersQuery.isError
                  ? roomMembers.map((member) => (
                      <div key={member.userId} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                        <span className="text-sm font-medium text-slate-700">{member.nickname}</span>
                        {isHostUser && currentUserId !== member.userId ? (
                          <button
                            type="button"
                            onClick={() => {
                              void handleKickMember(member.userId);
                            }}
                            className="rounded-xl bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
                          >
                            강퇴
                          </button>
                        ) : null}
                      </div>
                    ))
                  : null}
              </section>
            </>
          ) : null}
        </article>
      ) : null}

      {editRoomId && editRoomInitialValues ? (
        <CreateRoomModal
          isOpen={isEditRoomModalOpen}
          onClose={() => setIsEditRoomModalOpen(false)}
          onRequireLogin={onRequireLogin}
          mode="edit"
          roomId={editRoomId}
          initialValues={editRoomInitialValues}
          onSuccess={handleEditRoomSuccess}
        />
      ) : null}
    </section>
  );
};

export default RoomSection;
