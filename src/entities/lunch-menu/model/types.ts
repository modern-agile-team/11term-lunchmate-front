export type LunchMealType = 'BREAKFAST' | 'LUNCH' | 'DINNER';
export type LunchReactionType = 'LIKE' | 'DISLIKE' | null;

export interface MainLunchMenu {
  id: number;
  mealType: LunchMealType;
  menuName: string;
  price: number | null;
  calorie: number | null;
  schoolInfo: string;
  components: string[];
  likeCount: number;
  dislikeCount: number;
  myReaction: LunchReactionType;
}
