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

export const detailRoomTypeStyleMap = {
  MALE: {
    badgeClassName: 'bg-sky-100 text-sky-700',
    badgeLabel: '남성만',
  },
  FEMALE: {
    badgeClassName: 'bg-rose-100 text-rose-700',
    badgeLabel: '여성만',
  },
  MIXED: {
    badgeClassName: 'bg-indigo-100 text-indigo-700',
    badgeLabel: '혼성',
  },
} as const;

export const detailRoomStatusStyleMap = {
  OPEN: {
    badgeClassName: 'bg-emerald-100 text-emerald-700',
    badgeLabel: '모집중',
  },
  FULL: {
    badgeClassName: 'bg-amber-100 text-amber-700',
    badgeLabel: '정원도달',
  },
  CLOSE: {
    badgeClassName: 'bg-slate-200 text-slate-700',
    badgeLabel: '종료',
  },
} as const;
