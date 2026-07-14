export type LunchMealType = 'BREAKFAST' | 'LUNCH' | 'DINNER';

export const lunchMealTypeLabelMap: Record<LunchMealType, string> = {
  BREAKFAST: '아침',
  LUNCH: '점심',
  DINNER: '저녁',
};

export interface MainRankingItem {
  id: number;
  rank: number;
  menuName: string;
  mealType: LunchMealType;
  schoolInfo: string;
  likeCount: number;
  dislikeCount: number;
}
