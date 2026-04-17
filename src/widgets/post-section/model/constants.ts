import type { MainPostItem } from './types';

export type MainPostCategory = MainPostItem['category'];
export type MainPostCategoryFilter = 'ALL' | MainPostCategory;

export const postCategoryStyleMap: Record<MainPostCategory, string> = {
  FREE: 'bg-slate-100 text-slate-600',
  REVIEW: 'bg-amber-50 text-amber-700',
  INFO: 'bg-sky-50 text-sky-700',
  TALK: 'bg-violet-50 text-violet-700',
};

export const postCategoryIdMap: Record<MainPostCategory, number> = {
  FREE: 1,
  REVIEW: 2,
  INFO: 3,
  TALK: 4,
};

export const postCategoryIdLabelMap: Record<number, MainPostCategory> = {
  1: 'FREE',
  2: 'REVIEW',
  3: 'INFO',
  4: 'TALK',
};

export const postCategoryOptions: Array<{
  value: MainPostCategory;
  label: string;
}> = [
  { value: 'FREE', label: '자유' },
  { value: 'REVIEW', label: '리뷰' },
  { value: 'INFO', label: '정보' },
  { value: 'TALK', label: '잡담' },
];

export const postCategoryFilterOptions: Array<{
  value: MainPostCategoryFilter;
  label: string;
}> = [{ value: 'ALL', label: '전체' }, ...postCategoryOptions];
