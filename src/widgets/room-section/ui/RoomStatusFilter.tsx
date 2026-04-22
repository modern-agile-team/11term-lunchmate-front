import {
  roomStatusFilterOptions,
  type RoomFilterState,
  type RoomStatusFilter as RoomStatusFilterValue,
} from '../model/constants';
import RoomFilterChipGroup from './RoomFilterChipGroup';

interface RoomStatusFilterProps {
  value: RoomFilterState['status'];
  onChange: (value: RoomStatusFilterValue) => void;
}

const RoomStatusFilter = ({ value, onChange }: RoomStatusFilterProps) => (
  <RoomFilterChipGroup
    label="모집 상태"
    options={roomStatusFilterOptions}
    value={value}
    onChange={onChange}
  />
);

export default RoomStatusFilter;
