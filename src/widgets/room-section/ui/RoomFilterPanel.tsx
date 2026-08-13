import { RefreshCw } from 'lucide-react';
import RoomAgeFilter from './RoomAgeFilter';
import type { RoomFilterPanelProps } from './roomFilterPanel.types';
import RoomStatusFilter from './RoomStatusFilter';
import RoomTypeFilter from './RoomTypeFilter';

const RoomFilterPanel = ({
  roomFilterState,
  setRoomFilterState,
  onRefresh,
  isRefreshing,
}: RoomFilterPanelProps) => (
  <section className="rounded-[28px] border border-slate-200/80 bg-white px-5 py-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] md:px-6">
    <div className="space-y-4">
      <RoomTypeFilter
        value={roomFilterState.roomType}
        onChange={(value) =>
          setRoomFilterState((current) => ({ ...current, roomType: value }))
        }
      />
      <RoomStatusFilter
        value={roomFilterState.status}
        onChange={(value) =>
          setRoomFilterState((current) => ({ ...current, status: value }))
        }
      />
      <RoomAgeFilter
        minAge={roomFilterState.minAge}
        maxAge={roomFilterState.maxAge}
        onMinAgeChange={(value) =>
          setRoomFilterState((current) => ({ ...current, minAge: value }))
        }
        onMaxAgeChange={(value) =>
          setRoomFilterState((current) => ({ ...current, maxAge: value }))
        }
      />
      <button
        type="button"
        onClick={onRefresh}
        disabled={isRefreshing}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-slate-600 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        방 목록 새로고침
      </button>
    </div>
  </section>
);

export default RoomFilterPanel;
