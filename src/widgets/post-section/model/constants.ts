import { postCategoryOptions, type MainPostItem } from '@/entities/post';

export type MainPostCategory = MainPostItem['category'];
export type MainPostCategoryFilter = 'ALL' | MainPostCategory;

export const postCategoryFilterOptions: Array<{
  value: MainPostCategoryFilter;
  label: string;
}> = [{ value: 'ALL', label: '전체' }, ...postCategoryOptions];
