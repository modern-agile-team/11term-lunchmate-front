import RoomAgeFilter from './RoomAgeFilter';
import type { RoomFilterPanelProps } from './roomFilterPanel.types';
import RoomStatusFilter from './RoomStatusFilter';
import RoomTypeFilter from './RoomTypeFilter';

const RoomFilterPanel = ({
  roomFilterState,
  setRoomFilterState,
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
    </div>
  </section>
);

export default RoomFilterPanel;
