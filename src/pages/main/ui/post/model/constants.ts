import { postCategoryOptions } from '@/entities/post';
import type { MainPostItem } from './types';

export type MainPostCategory = MainPostItem['category'];
export type MainPostCategoryFilter = 'ALL' | MainPostCategory;

export const postCategoryStyleMap: Record<MainPostCategory, string> = {
  FREE: 'bg-slate-100 text-slate-600',
  REVIEW: 'bg-amber-50 text-amber-700',
  INFO: 'bg-sky-50 text-sky-700',
  TALK: 'bg-violet-50 text-violet-700',
};

export const postCategoryFilterOptions: Array<{
  value: MainPostCategoryFilter;
  label: string;
}> = [{ value: 'ALL', label: '전체' }, ...postCategoryOptions];
