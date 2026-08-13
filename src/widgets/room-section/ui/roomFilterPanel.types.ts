import type { RoomFilterState } from '../model/constants';

export interface RoomFilterPanelProps {
  roomFilterState: RoomFilterState;
  setRoomFilterState: (
    updater: (current: RoomFilterState) => RoomFilterState,
  ) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export interface RoomFilterChipOption<T extends string> {
  label: string;
  value: T;
}
