import type { RoomFilterState } from '../model/constants';

export interface RoomFilterPanelProps {
  roomFilterState: RoomFilterState;
  setRoomFilterState: (
    updater: (current: RoomFilterState) => RoomFilterState,
  ) => void;
}

export interface RoomFilterChipOption<T extends string> {
  label: string;
  value: T;
}
