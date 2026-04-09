import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import type { MainTab } from '../../model/types';
import MainBoardSection from '../board/MainBoardSection';
import MainLunchMenuSection from '../lunch/MainLunchMenuSection';
import MainRankingSection from '../ranking/MainRankingSection';
import RoomCard from '../room/RoomCard';
import RoomSummary from '../room/RoomSummary';
import type { MainRoom } from '../room/types';
import type { RoomListFilters, RoomListItemResponse } from '@/shared/api/rooms/rooms';
import { roomsListQueryOptions } from '@/shared/api/rooms/roomsQueries';
import { cn } from '@/shared/lib/utils';

interface MainTabSectionProps {
  activeTab: MainTab;
  onCreateRoomClick: () => void;
}

type RoomTypeFilter = 'ALL' | 'ANY' | 'MALE' | 'FEMALE';
type RoomStatusFilter = 'ALL' | 'OPEN' | 'FULL' | 'CLOSE';

interface RoomFilterState {
  roomType: RoomTypeFilter;
  status: RoomStatusFilter;
  minAge: string;
  maxAge: string;
}

const tabDescriptionMap: Record<MainTab, string> = {
  ROOM: '현재 열려 있는 점심 방을 둘러보고, 바로 참여할 수 있어요.',
  LUNCH: '오늘 먹을 수 있는 학식 메뉴를 mock 데이터로 먼저 확인해보세요.',
  RANKING: '좋아요를 많이 받은 인기 학식 메뉴를 둘러보세요.',
  BOARD: '자유게시판에서 점심메이트와 가볍게 소통해보세요.',
};

const INITIAL_ROOM_FILTER_STATE: RoomFilterState = {
  roomType: 'ALL',
  status: 'ALL',
  minAge: '',
  maxAge: '',
};

const roomTypeFilterOptions: Array<{ label: string; value: RoomTypeFilter }> = [
  { label: '전체', value: 'ALL' },
  { label: '혼성', value: 'ANY' },
  { label: '남성', value: 'MALE' },
  { label: '여성', value: 'FEMALE' },
];

const roomStatusFilterOptions: Array<{ label: string; value: RoomStatusFilter }> = [
  { label: '전체', value: 'ALL' },
  { label: '모집중', value: 'OPEN' },
  { label: '마감임박/정원도달', value: 'FULL' },
  { label: '종료', value: 'CLOSE' },
];

const toMainRoomType = (roomType: RoomListItemResponse['roomType']): MainRoom['roomType'] => {
  if (roomType === 'MALE' || roomType === 'FEMALE') {
    return roomType;
  }

  return 'MIXED';
};

const formatLunchAt = (lunchAt: string): string => {
  const timeMatch = lunchAt.match(/(?:T|\s)?(\d{2}:\d{2})/);

  if (timeMatch) {
    return timeMatch[1];
  }

  return lunchAt;
};

const toMainRoom = (room: RoomListItemResponse): MainRoom => ({
  id: room.id,
  title: room.title,
  roomType: toMainRoomType(room.roomType),
  minAge: room.minAge,
  maxAge: room.maxAge,
  currentCount: room.currentCount,
  capacity: room.maxMembersCount,
  place: room.place,
  lunchAt: formatLunchAt(room.lunchAt),
});

const parseAgeFilter = (value: string): number | undefined => {
  if (value.trim() === '') {
    return undefined;
  }

  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) {
    return undefined;
  }

  return parsedValue;
};

const toRoomListFilters = (roomFilterState: RoomFilterState): RoomListFilters => ({
  roomType: roomFilterState.roomType === 'ALL' ? undefined : roomFilterState.roomType,
  status: roomFilterState.status === 'ALL' ? undefined : roomFilterState.status,
  minAge: parseAgeFilter(roomFilterState.minAge),
  maxAge: parseAgeFilter(roomFilterState.maxAge),
});

const MainTabSection = ({ activeTab, onCreateRoomClick }: MainTabSectionProps) => {
  const isRoomTab = activeTab === 'ROOM';
  const [roomFilterState, setRoomFilterState] = useState<RoomFilterState>(INITIAL_ROOM_FILTER_STATE);
  const roomFilters = toRoomListFilters(roomFilterState);
  const { data, isLoading, isError, error } = useQuery({
    ...roomsListQueryOptions(roomFilters),
    enabled: isRoomTab,
  });
  const rooms = data?.items.map(toMainRoom) ?? [];

  return (
    <section className="space-y-4 md:space-y-5">
      <div className="flex flex-col gap-4 rounded-[28px] border border-slate-200/80 bg-white px-5 py-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] md:flex-row md:items-center md:justify-between md:px-6">
        <div>
          <h2 className="text-[22px] font-bold tracking-[-0.03em] text-slate-900">
            {isRoomTab ? '점심 방 둘러보기' : activeTab === 'LUNCH' ? '오늘의 학식 메뉴' : activeTab === 'RANKING' ? '지금 인기 있는 메뉴' : '자유게시판'}
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
            ? rooms.map((room) => <RoomCard key={room.id} room={room} />)
            : null}
        </div>
      ) : null}

      {activeTab === 'LUNCH' ? <MainLunchMenuSection /> : null}
      {activeTab === 'RANKING' ? <MainRankingSection /> : null}
      {activeTab === 'BOARD' ? <MainBoardSection /> : null}
    </section>
  );
};

export default MainTabSection;
