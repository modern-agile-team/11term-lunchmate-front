import type { ChangeEvent } from 'react';

import type { RoomListParams, RoomType } from '@/entities/room/model/types';

interface MainFiltersProps {
  roomListParams: RoomListParams;
  onChangeRoomType: (roomType: RoomType | undefined) => void;
  onChangeCode: (code: string) => void;
  onChangeMinAge: (minAge: number | undefined) => void;
  onChangeMaxAge: (maxAge: number | undefined) => void;
  onChangeTimeFrom: (timeFrom: string) => void;
  onChangeTimeTo: (timeTo: string) => void;
  onReset: () => void;
}

const roomTypeOptions: Array<{ label: string; value: RoomType }> = [
  { label: '혼성', value: 'MIXED' },
  { label: '여성', value: 'FEMALE' },
  { label: '남성', value: 'MALE' },
];

const getNumberValue = (event: ChangeEvent<HTMLInputElement>) => {
  if (!event.target.value) {
    return undefined;
  }

  return Number(event.target.value);
};

const MainFilters = ({
  roomListParams,
  onChangeRoomType,
  onChangeCode,
  onChangeMinAge,
  onChangeMaxAge,
  onChangeTimeFrom,
  onChangeTimeTo,
  onReset,
}: MainFiltersProps) => {
  return (
    <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">방 목록 필터</h2>
          <p className="mt-1 text-sm text-slate-500">조건에 맞는 점심 방만 빠르게 찾아보세요.</p>
        </div>

        <button
          type="button"
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-50"
          onClick={onReset}
        >
          초기화
        </button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
          방 구분
          <select
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-300"
            value={roomListParams.roomType ?? ''}
            onChange={(event) => {
              const nextRoomType = event.target.value as RoomType;

              onChangeRoomType(nextRoomType || undefined);
            }}
          >
            <option value="">전체</option>
            {roomTypeOptions.map((roomTypeOption) => (
              <option key={roomTypeOption.value} value={roomTypeOption.value}>
                {roomTypeOption.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
          코드 검색
          <input
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-300"
            placeholder="방 코드 입력"
            value={roomListParams.code ?? ''}
            onChange={(event) => {
              onChangeCode(event.target.value);
            }}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
          최소 나이
          <input
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-300"
            placeholder="예: 20"
            type="number"
            value={roomListParams.minAge ?? ''}
            onChange={(event) => {
              onChangeMinAge(getNumberValue(event));
            }}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
          최대 나이
          <input
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-300"
            placeholder="예: 25"
            type="number"
            value={roomListParams.maxAge ?? ''}
            onChange={(event) => {
              onChangeMaxAge(getNumberValue(event));
            }}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
          시작 시간
          <input
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-300"
            type="time"
            value={roomListParams.timeFrom ?? ''}
            onChange={(event) => {
              onChangeTimeFrom(event.target.value);
            }}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
          종료 시간
          <input
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-300"
            type="time"
            value={roomListParams.timeTo ?? ''}
            onChange={(event) => {
              onChangeTimeTo(event.target.value);
            }}
          />
        </label>
      </div>
    </section>
  );
};

export default MainFilters;
