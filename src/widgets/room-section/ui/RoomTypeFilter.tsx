import {
  roomTypeFilterOptions,
  type RoomFilterState,
  type RoomTypeFilter as RoomTypeFilterValue,
} from '../model/constants';
import RoomFilterChipGroup from './RoomFilterChipGroup';

interface RoomTypeFilterProps {
  value: RoomFilterState['roomType'];
  onChange: (value: RoomTypeFilterValue) => void;
}

const RoomTypeFilter = ({ value, onChange }: RoomTypeFilterProps) => (
  <RoomFilterChipGroup
    label="방 구분"
    options={roomTypeFilterOptions}
    value={value}
    onChange={onChange}
  />
);

export default RoomTypeFilter;
