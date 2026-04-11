import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { Clock3, MapPin, Plus, Users } from 'lucide-react';
import { isAuthenticated } from '@/app/authSessionStore';
import type { MainTab } from '../../model/types';
import MainBoardSection from '../board/MainBoardSection';
import MainLunchMenuSection from '../lunch/MainLunchMenuSection';
import MainRankingSection from '../ranking/MainRankingSection';
import RoomCard from '../room/RoomCard';
import RoomSummary from '../room/RoomSummary';
import { joinRoom, kickRoomMember, leaveRoom } from '@/shared/api/rooms/rooms';
import { roomQueries } from '@/shared/api/rooms/roomsQueries';
import { myUserQueryOptions } from '@/shared/api/users/meQueries';
import { cn } from '@/shared/lib/utils';
import {
  detailRoomStatusStyleMap,
  detailRoomTypeStyleMap,
  INITIAL_ROOM_FILTER_STATE,
  roomStatusFilterOptions,
  roomTypeFilterOptions,
  type RoomFilterState,
} from '../room/roomTab.constants';
import {
  formatLunchAt,
  getDetailRoomCurrentCount,
  toDetailRoomStatus,
  toDetailRoomType,
  toMainRoom,
  toRoomListFilters,
} from '../room/roomTab.utils';

interface MainTabSectionProps {
  activeTab: MainTab;
  onCreateRoomClick: () => void;
  onJoinRequireLogin: () => void;
}

interface ApiErrorPayload {
  message?: string | string[];
}

const tabDescriptionMap: Record<MainTab, string> = {
  ROOM: '현재 열려 있는 점심 방을 둘러보고, 바로 참여할 수 있어요.',
  LUNCH: '오늘 먹을 수 있는 학식 메뉴를 mock 데이터로 먼저 확인해보세요.',
  RANKING: '좋아요를 많이 받은 인기 학식 메뉴를 둘러보세요.',
  BOARD: '자유게시판에서 점심메이트와 가볍게 소통해보세요.',
};

const getRoomActionErrorMessage = (error: unknown, action: 'join' | 'leave') => {
  if (isAxiosError<ApiErrorPayload>(error)) {
    const responseMessage = error.response?.data?.message;

    if (Array.isArray(responseMessage) && responseMessage.length > 0) {
      return responseMessage.join(' ');
    }

    if (typeof responseMessage === 'string' && responseMessage.trim() !== '') {
      return responseMessage;
    }

    if (error.response?.status === 403) {
      return action === 'leave' ? '나갈 수 없는 방이에요.' : '참여할 수 없는 방이에요.';
    }

    if (error.response?.status === 404) {
      return '방을 찾을 수 없어요.';
    }

    if (error.response?.status === 409) {
      return action === 'leave'
        ? '이미 나간 방이거나 나갈 수 없는 상태예요.'
        : '이미 다른 방에 참여 중이거나 이미 참여한 방이에요.';
    }
  }

  if (error instanceof Error && error.message.trim() !== '') {
    return error.message;
  }

  return action === 'leave'
    ? '방 나가기에 실패했어요. 잠시 후 다시 시도해 주세요.'
    : '방 참여에 실패했어요. 잠시 후 다시 시도해 주세요.';
};

const getRoomMembersErrorMessage = (error: unknown) => {
  if (isAxiosError<ApiErrorPayload>(error)) {
    if (error.response?.status === 401) {
      return '로그인 후 멤버를 확인할 수 있어요.';
    }

    if (error.response?.status === 403) {
      return '멤버를 확인할 수 없어요.';
    }

    if (error.response?.status === 404) {
      return '방을 찾을 수 없어요.';
    }
  }

  return '멤버 목록을 불러오지 못했어요.';
};

const getKickMemberErrorMessage = (error: unknown) => {
  if (isAxiosError<ApiErrorPayload>(error)) {
    const responseMessage = error.response?.data?.message;

    if (Array.isArray(responseMessage) && responseMessage.length > 0) {
      return responseMessage.join(' ');
    }

    if (typeof responseMessage === 'string' && responseMessage.trim() !== '') {
      return responseMessage;
    }

    if (error.response?.status === 403) {
      return '강퇴할 권한이 없어요.';
    }

    if (error.response?.status === 404) {
      return '방 또는 멤버를 찾을 수 없어요.';
    }

    if (error.response?.status === 409) {
      return '강퇴할 수 없는 상태예요.';
    }
  }

  if (error instanceof Error && error.message.trim() !== '') {
    return error.message;
  }

  return '멤버 강퇴에 실패했어요. 잠시 후 다시 시도해 주세요.';
};

const MainTabSection = ({
  activeTab,
  onCreateRoomClick,
  onJoinRequireLogin,
}: MainTabSectionProps) => {
  const queryClient = useQueryClient();
  const isRoomTab = activeTab === 'ROOM';
  const [roomFilterState, setRoomFilterState] = useState<RoomFilterState>(INITIAL_ROOM_FILTER_STATE);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [joinedRoomId, setJoinedRoomId] = useState<number | null>(null);
  const [roomActionMessage, setRoomActionMessage] = useState('');
  const [roomActionMessageTone, setRoomActionMessageTone] = useState<'success' | 'error'>(
    'success',
  );
  const roomFilters = toRoomListFilters(roomFilterState);
  const isLoggedIn = isAuthenticated();
  const { data, isLoading, isError, error } = useQuery({
    ...roomQueries.list(roomFilters),
    enabled: isRoomTab,
  });
  const { data: currentUser } = useQuery({
    ...myUserQueryOptions(),
    enabled: isRoomTab && isLoggedIn,
  });
  const {
    data: roomDetail,
    isLoading: isRoomDetailLoading,
    isError: isRoomDetailError,
    error: roomDetailError,
  } = useQuery({
    ...roomQueries.detail(selectedRoomId ?? 0),
    enabled: isRoomTab && selectedRoomId !== null,
  });
  const {
    data: roomMembersData,
    isLoading: isRoomMembersLoading,
    isError: isRoomMembersError,
    error: roomMembersError,
  } = useQuery({
    ...roomQueries.members(selectedRoomId ?? 0),
    enabled: isRoomTab && selectedRoomId !== null && roomDetail !== undefined,
  });
  const joinRoomMutation = useMutation({
    mutationFn: joinRoom,
    onSuccess: async ({ roomId }) => {
      setJoinedRoomId(roomId);
      setRoomActionMessage('방에 참여했어요.');
      setRoomActionMessageTone('success');

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: roomQueries.lists() }),
        queryClient.invalidateQueries({ queryKey: roomQueries.detail(roomId).queryKey }),
        queryClient.invalidateQueries({ queryKey: roomQueries.members(roomId).queryKey }),
      ]);
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 401) {
        setRoomActionMessage('로그인 후 방에 참여할 수 있어요.');
        setRoomActionMessageTone('error');
        onJoinRequireLogin();
        return;
      }

      setRoomActionMessage(getRoomActionErrorMessage(error, 'join'));
      setRoomActionMessageTone('error');
    },
  });
  const leaveRoomMutation = useMutation({
    mutationFn: leaveRoom,
    onSuccess: async (_, roomId) => {
      setJoinedRoomId((currentRoomId) => (currentRoomId === roomId ? null : currentRoomId));
      setRoomActionMessage('방에서 나갔어요.');
      setRoomActionMessageTone('success');

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: roomQueries.lists() }),
        queryClient.invalidateQueries({ queryKey: roomQueries.detail(roomId).queryKey }),
        queryClient.invalidateQueries({ queryKey: roomQueries.members(roomId).queryKey }),
      ]);
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 401) {
        setRoomActionMessage('로그인 후 방을 나갈 수 있어요.');
        setRoomActionMessageTone('error');
        onJoinRequireLogin();
        return;
      }

      setRoomActionMessage(getRoomActionErrorMessage(error, 'leave'));
      setRoomActionMessageTone('error');
    },
  });
  const kickRoomMemberMutation = useMutation({
    mutationFn: kickRoomMember,
    onSuccess: async (_, variables) => {
      setRoomActionMessage('멤버를 강퇴했어요.');
      setRoomActionMessageTone('success');

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: roomQueries.lists() }),
        queryClient.invalidateQueries({ queryKey: roomQueries.detail(variables.roomId).queryKey }),
        queryClient.invalidateQueries({ queryKey: roomQueries.members(variables.roomId).queryKey }),
      ]);
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 401) {
        setRoomActionMessage('로그인 후 강퇴할 수 있어요.');
        setRoomActionMessageTone('error');
        onJoinRequireLogin();
        return;
      }

      setRoomActionMessage(getKickMemberErrorMessage(error));
      setRoomActionMessageTone('error');
    },
  });
  const rooms = data?.items.map(toMainRoom) ?? [];

  useEffect(() => {
    if (!isRoomTab) {
      return;
    }

    if (rooms.length === 0) {
      setSelectedRoomId(null);
      return;
    }

    const hasSelectedRoom =
      selectedRoomId !== null && rooms.some((room) => room.id === selectedRoomId);

    if (!hasSelectedRoom) {
      setSelectedRoomId(rooms[0].id);
    }
  }, [isRoomTab, rooms, selectedRoomId]);

  const handleJoinClick = (roomId: number) => {
    if (!isAuthenticated()) {
      setRoomActionMessage('로그인 후 방에 참여할 수 있어요.');
      setRoomActionMessageTone('error');
      onJoinRequireLogin();
      return;
    }

    setRoomActionMessage('');
    joinRoomMutation.mutate(roomId);
  };
  const handleLeaveClick = (roomId: number) => {
    if (!isAuthenticated()) {
      setRoomActionMessage('로그인 후 방을 나갈 수 있어요.');
      setRoomActionMessageTone('error');
      onJoinRequireLogin();
      return;
    }

    setRoomActionMessage('');
    leaveRoomMutation.mutate(roomId);
  };

  const hasJoinedActiveRoom = joinedRoomId !== null;
  const roomMembers = roomMembersData?.items ?? [];
  const currentUserId = currentUser?.id ?? null;
  const isHostUser = roomDetail !== undefined && currentUserId === roomDetail.hostUserId;

  return (
    <section className="space-y-4 md:space-y-5">
      <div className="flex flex-col gap-4 rounded-[28px] border border-slate-200/80 bg-white px-5 py-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] md:flex-row md:items-center md:justify-between md:px-6">
        <div>
          <h2 className="text-[22px] font-bold tracking-[-0.03em] text-slate-900">
            {isRoomTab
              ? '점심 방 둘러보기'
              : activeTab === 'LUNCH'
                ? '오늘의 학식 메뉴'
                : activeTab === 'RANKING'
                  ? '지금 인기 있는 메뉴'
                  : '자유게시판'}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">{tabDescriptionMap[activeTab]}</p>
        </div>

        {isRoomTab ? (
          <button
            type="button"
            onClick={onCreateRoomClick}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            방 만들기
          </button>
        ) : null}
      </div>

      {isRoomTab ? (
        <section className="rounded-[28px] border border-slate-200/80 bg-white px-5 py-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] md:px-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-700">방 구분</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {roomTypeFilterOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setRoomFilterState((current) => ({
                        ...current,
                        roomType: option.value,
                      }))
                    }
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
                    onClick={() =>
                      setRoomFilterState((current) => ({
                        ...current,
                        status: option.value,
                      }))
                    }
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
                  onChange={(event) =>
                    setRoomFilterState((current) => ({
                      ...current,
                      minAge: event.target.value,
                    }))
                  }
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
                  onChange={(event) =>
                    setRoomFilterState((current) => ({
                      ...current,
                      maxAge: event.target.value,
                    }))
                  }
                  placeholder="예: 24"
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                />
              </label>
            </div>
          </div>
        </section>
      ) : null}

      {isRoomTab && !isLoading && !isError ? <RoomSummary roomCount={rooms.length} /> : null}

      {isRoomTab && roomActionMessage ? (
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

      {activeTab === 'ROOM' ? (
        <div className="space-y-4 md:space-y-5">
          {isLoading ? (
            <section className="rounded-[28px] border border-slate-200/80 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
              점심 방을 불러오는 중...
            </section>
          ) : null}

          {isError ? (
            <section className="rounded-[28px] border border-rose-200 bg-rose-50 px-6 py-10 text-center text-sm text-rose-600 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
              점심 방을 불러오지 못했어요.
              {error instanceof Error ? ` ${error.message}` : ''}
            </section>
          ) : null}

          {!isLoading && !isError && rooms.length === 0 ? (
            <section className="rounded-[28px] border border-slate-200/80 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
              아직 열려 있는 점심 방이 없어요.
            </section>
          ) : null}

          {!isLoading && !isError
            ? rooms.map((room) => {
                const isJoinPending =
                  joinRoomMutation.isPending && joinRoomMutation.variables === room.id;
                const isLeavePending =
                  leaveRoomMutation.isPending && leaveRoomMutation.variables === room.id;
                const isActionPending = isJoinPending || isLeavePending;
                const isFullRoom = room.currentCount >= room.capacity;
                const isJoinedRoom = joinedRoomId === room.id;
                const actionDisabled = isJoinedRoom
                  ? isActionPending
                  : isFullRoom || isActionPending || hasJoinedActiveRoom;
                const actionLabel = isJoinedRoom
                  ? '나가기'
                  : isFullRoom
                    ? '정원 마감'
                    : hasJoinedActiveRoom
                      ? '다른 방 참여 중'
                      : '참여하기';
                const handleRoomActionClick = isJoinedRoom ? handleLeaveClick : handleJoinClick;

                return (
                  <RoomCard
                    key={room.id}
                    room={room}
                    isSelected={selectedRoomId === room.id}
                    onClick={() => setSelectedRoomId(room.id)}
                    onActionClick={handleRoomActionClick}
                    isActionPending={isActionPending}
                    actionDisabled={actionDisabled}
                    actionLabel={actionLabel}
                  />
                );
              })
            : null}
        </div>
      ) : null}

      {isRoomTab && selectedRoomId !== null && !isLoading && !isError ? (
        <>
          {isRoomDetailLoading ? (
            <article className="rounded-[32px] border border-slate-200/80 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-[0_16px_40px_rgba(15,23,42,0.06)] md:px-7">
              방 상세 정보를 불러오는 중...
            </article>
          ) : null}

          {isRoomDetailError ? (
            <article className="rounded-[32px] border border-rose-200 bg-rose-50 px-6 py-10 text-center text-sm text-rose-600 shadow-[0_16px_40px_rgba(15,23,42,0.06)] md:px-7">
              방 상세 정보를 불러오지 못했어요.
              {roomDetailError instanceof Error ? ` ${roomDetailError.message}` : ''}
            </article>
          ) : null}

          {roomDetail && !isRoomDetailLoading && !isRoomDetailError ? (
            <article className="rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] md:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        'rounded-full px-3 py-1 text-xs font-semibold',
                        detailRoomTypeStyleMap[toDetailRoomType(roomDetail.roomType)].badgeClassName,
                      )}
                    >
                      {detailRoomTypeStyleMap[toDetailRoomType(roomDetail.roomType)].badgeLabel}
                    </span>
                    <span
                      className={cn(
                        'rounded-full px-3 py-1 text-xs font-semibold',
                        detailRoomStatusStyleMap[toDetailRoomStatus(roomDetail.status)]
                          .badgeClassName,
                      )}
                    >
                      {detailRoomStatusStyleMap[toDetailRoomStatus(roomDetail.status)].badgeLabel}
                    </span>
                  </div>
                  <h3 className="mt-4 text-[26px] font-bold tracking-[-0.03em] text-slate-900">
                    {roomDetail.title}
                  </h3>
                  <p className="mt-3 max-w-2xl whitespace-pre-line text-sm leading-7 text-slate-600">
                    {roomDetail.description?.trim() || '방 소개가 아직 없어요.'}
                  </p>
                </div>

                <div className="rounded-[24px] bg-slate-50 px-5 py-4">
                  <div className="text-xs font-semibold text-slate-500">모집 정보</div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                    <Users className="h-4 w-4 text-slate-500" />
                    <span className="font-semibold text-slate-900">
                      {getDetailRoomCurrentCount(roomDetail)}/{roomDetail.maxMembersCount}명
                    </span>
                  </div>
                  <div className="mt-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                    {roomDetail.minAge}-{roomDetail.maxAge}대
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <section className="rounded-[24px] bg-slate-50 px-5 py-5">
                  <h4 className="text-sm font-semibold text-slate-700">장소</h4>
                  <div className="mt-3 inline-flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="h-4 w-4 text-indigo-500" />
                    {roomDetail.place}
                  </div>
                </section>

                <section className="rounded-[24px] bg-slate-50 px-5 py-5">
                  <h4 className="text-sm font-semibold text-slate-700">시간</h4>
                  <div className="mt-3 inline-flex items-center gap-2 text-sm text-slate-600">
                    <Clock3 className="h-4 w-4 text-indigo-500" />
                    {formatLunchAt(roomDetail.lunchAt)}
                  </div>
                </section>
              </div>

              <section className="mt-6 rounded-[24px] bg-slate-50 px-5 py-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700">멤버 목록</h4>
                    <p className="mt-1 text-xs text-slate-500">현재 참여 중인 멤버를 확인할 수 있어요.</p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                    <Users className="h-3.5 w-3.5 text-slate-500" />
                    {getDetailRoomCurrentCount(roomDetail)}명
                  </div>
                </div>

                {isRoomMembersLoading ? (
                  <div className="mt-4 rounded-2xl bg-white px-4 py-4 text-sm text-slate-500">
                    멤버 목록을 불러오는 중...
                  </div>
                ) : null}

                {isRoomMembersError ? (
                  <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-600">
                    {getRoomMembersErrorMessage(roomMembersError)}
                  </div>
                ) : null}

                {!isRoomMembersLoading && !isRoomMembersError && roomMembers.length === 0 ? (
                  <div className="mt-4 rounded-2xl bg-white px-4 py-4 text-sm text-slate-500">
                    아직 참여한 멤버가 없어요.
                  </div>
                ) : null}

                {!isRoomMembersLoading && !isRoomMembersError && roomMembers.length > 0 ? (
                  <ul className="mt-4 space-y-3">
                    {roomMembers.map((member) => {
                      const isHost = roomDetail.hostUserId === member.userId;
                      const isKickPending =
                        kickRoomMemberMutation.isPending &&
                        kickRoomMemberMutation.variables?.roomId === roomDetail.id &&
                        kickRoomMemberMutation.variables?.userId === member.userId;
                      const canKickMember = isHostUser && !isHost;

                      return (
                        <li
                          key={member.userId}
                          className="flex items-center justify-between rounded-2xl bg-white px-4 py-3"
                        >
                          <span className="text-sm font-medium text-slate-700">{member.nickname}</span>
                          <div className="flex items-center gap-2">
                            {isHost ? (
                              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                                방장
                              </span>
                            ) : null}
                            {canKickMember ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setRoomActionMessage('');
                                  kickRoomMemberMutation.mutate({
                                    roomId: roomDetail.id,
                                    userId: member.userId,
                                  });
                                }}
                                disabled={isKickPending}
                                className={cn(
                                  'rounded-full px-3 py-1 text-xs font-semibold transition',
                                  isKickPending
                                    ? 'cursor-not-allowed bg-slate-200 text-slate-500'
                                    : 'bg-rose-100 text-rose-600 hover:bg-rose-200',
                                )}
                              >
                                {isKickPending ? '강퇴 중...' : '강퇴'}
                              </button>
                            ) : null}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </section>
            </article>
          ) : null}
        </>
      ) : null}

      {activeTab === 'LUNCH' ? <MainLunchMenuSection /> : null}
      {activeTab === 'RANKING' ? <MainRankingSection /> : null}
      {activeTab === 'BOARD' ? <MainBoardSection /> : null}
    </section>
  );
};

export default MainTabSection;
