import { cn } from '@/shared/lib/utils';
import {
  roomStatusFilterOptions,
  roomTypeFilterOptions,
  type RoomFilterState,
} from '../model/constants';

interface RoomFilterPanelProps {
  roomFilterState: RoomFilterState;
  setRoomFilterState: (
    updater: (current: RoomFilterState) => RoomFilterState,
  ) => void;
}

const RoomFilterPanel = ({
  roomFilterState,
  setRoomFilterState,
}: RoomFilterPanelProps) => (
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
);

export default RoomFilterPanel;
