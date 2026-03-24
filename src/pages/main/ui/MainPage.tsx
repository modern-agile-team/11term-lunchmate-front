import { useDeferredValue, useState } from 'react';
import { AlertTriangle, Inbox, LoaderCircle, Wifi } from 'lucide-react';

import type { RoomListParams, RoomType } from '@/entities/room/model/types';
import { useRoomListQuery } from '../model/useRoomListQuery';
import MainFilters from './MainFilters';
import MainHeader from './MainHeader';
import MainHero from './MainHero';
import MainTabs from './MainTabs';
import RoomCard from './RoomCard';
import RoomSummary from './RoomSummary';

const initialRoomListParams: RoomListParams = {};

const MainPage = () => {
  const [roomListParams, setRoomListParams] = useState<RoomListParams>(initialRoomListParams);
  const deferredRoomListParams = useDeferredValue(roomListParams);
  const { data, isLoading, isError } = useRoomListQuery(deferredRoomListParams);

  const rooms = data?.items ?? [];

  const updateRoomListParams = (nextRoomListParams: Partial<RoomListParams>) => {
    setRoomListParams((prevRoomListParams) => ({
      ...prevRoomListParams,
      ...nextRoomListParams,
    }));
  };

  const handleChangeRoomType = (roomType: RoomType | undefined) => {
    updateRoomListParams({ roomType });
  };

  const handleChangeCode = (code: string) => {
    updateRoomListParams({ code: code || undefined });
  };

  const handleChangeMinAge = (minAge: number | undefined) => {
    updateRoomListParams({ minAge });
  };

  const handleChangeMaxAge = (maxAge: number | undefined) => {
    updateRoomListParams({ maxAge });
  };

  const handleChangeTimeFrom = (timeFrom: string) => {
    updateRoomListParams({ timeFrom: timeFrom || undefined });
  };

  const handleChangeTimeTo = (timeTo: string) => {
    updateRoomListParams({ timeTo: timeTo || undefined });
  };

  const handleReset = () => {
    setRoomListParams(initialRoomListParams);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <MainHeader />

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-5 py-6 md:px-8">
        <MainHero />
        <MainTabs />
        <MainFilters
          roomListParams={roomListParams}
          onChangeRoomType={handleChangeRoomType}
          onChangeCode={handleChangeCode}
          onChangeMinAge={handleChangeMinAge}
          onChangeMaxAge={handleChangeMaxAge}
          onChangeTimeFrom={handleChangeTimeFrom}
          onChangeTimeTo={handleChangeTimeTo}
          onReset={handleReset}
        />
        <RoomSummary roomCount={rooms.length} />

        <section className="flex items-center gap-2 rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
          <Wifi className="h-4 w-4" />
          <span className="font-medium">실시간 방 목록 조회가 적용된 상태예요.</span>
        </section>

        {isLoading ? (
          <section className="rounded-[28px] border border-slate-200 bg-white px-6 py-10 text-center shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <div className="flex flex-col items-center gap-3 text-slate-500">
              <LoaderCircle className="h-6 w-6 animate-spin" />
              <p className="text-sm font-medium">방 목록을 불러오는 중이에요.</p>
            </div>
          </section>
        ) : null}

        {isError ? (
          <section className="rounded-[28px] border border-rose-100 bg-rose-50 px-6 py-10 text-center">
            <div className="flex flex-col items-center gap-3 text-rose-500">
              <AlertTriangle className="h-6 w-6" />
              <p className="text-sm font-medium">방 목록을 불러오지 못했어요.</p>
              <p className="text-xs text-rose-400">
                서버 실행 상태나 로그인 토큰 여부를 확인한 뒤 다시 시도해주세요.
              </p>
            </div>
          </section>
        ) : null}

        {!isLoading && !isError && rooms.length === 0 ? (
          <section className="rounded-[28px] border border-slate-200 bg-white px-6 py-10 text-center shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <div className="flex flex-col items-center gap-3 text-slate-500">
              <Inbox className="h-6 w-6" />
              <p className="text-sm font-medium">아직 열린 점심 방이 없어요.</p>
            </div>
          </section>
        ) : null}

        {!isLoading && !isError && rooms.length > 0 ? (
          <section className="space-y-4">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </section>
        ) : null}
      </main>
    </div>
  );
};

export default MainPage;
