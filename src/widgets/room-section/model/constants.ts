export type RoomTypeFilter = 'ALL' | 'ANY' | 'MALE' | 'FEMALE';
export type RoomStatusFilter = 'ALL' | 'OPEN' | 'FULL' | 'CLOSE';

export interface RoomFilterState {
  roomType: RoomTypeFilter;
  status: RoomStatusFilter;
  minAge: string;
  maxAge: string;
}

export const INITIAL_ROOM_FILTER_STATE: RoomFilterState = {
  roomType: 'ALL',
  status: 'ALL',
  minAge: '',
  maxAge: '',
};

export const roomTypeFilterOptions: Array<{ label: string; value: RoomTypeFilter }> = [
  { label: '전체', value: 'ALL' },
  { label: '혼성', value: 'ANY' },
  { label: '남성', value: 'MALE' },
  { label: '여성', value: 'FEMALE' },
];

export const roomStatusFilterOptions: Array<{ label: string; value: RoomStatusFilter }> = [
  { label: '전체', value: 'ALL' },
  { label: '모집중', value: 'OPEN' },
  { label: '마감임박/정원도달', value: 'FULL' },
  { label: '종료', value: 'CLOSE' },
];
