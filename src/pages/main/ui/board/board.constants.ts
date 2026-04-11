import type { MainBoardPost } from './types';

export type MainBoardCategory = MainBoardPost['category'];
export type MainBoardCategoryFilter = 'ALL' | MainBoardCategory;

export const boardCategoryStyleMap: Record<MainBoardCategory, string> = {
  FREE: 'bg-slate-100 text-slate-600',
  REVIEW: 'bg-amber-50 text-amber-700',
  INFO: 'bg-sky-50 text-sky-700',
  TALK: 'bg-violet-50 text-violet-700',
};

export const boardCategoryIdMap: Record<MainBoardCategory, number> = {
  FREE: 1,
  REVIEW: 2,
  INFO: 3,
  TALK: 4,
};

export const boardCategoryIdLabelMap: Record<number, MainBoardCategory> = {
  1: 'FREE',
  2: 'REVIEW',
  3: 'INFO',
  4: 'TALK',
};

export const boardCategoryFilterOptions: Array<{
  value: MainBoardCategoryFilter;
  label: string;
}> = [
  { value: 'ALL', label: '전체' },
  { value: 'FREE', label: '자유' },
  { value: 'REVIEW', label: '리뷰' },
  { value: 'INFO', label: '정보' },
  { value: 'TALK', label: '잡담' },
];
