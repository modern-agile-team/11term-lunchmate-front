import type { MainPostCategory } from './mainPost';

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
