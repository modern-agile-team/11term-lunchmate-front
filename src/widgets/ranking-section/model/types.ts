import type { LunchMealType } from '@/entities/lunch-menu';

export { lunchMealTypeLabelMap } from '@/entities/lunch-menu';

export interface MainRankingItem {
  id: number;
  rank: number;
  menuName: string;
  mealType: LunchMealType;
  schoolInfo: string;
  likeCount: number;
  dislikeCount: number;
}