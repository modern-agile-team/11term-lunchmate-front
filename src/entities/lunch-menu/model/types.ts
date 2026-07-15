export type LunchMealType = 'BREAKFAST' | 'LUNCH' | 'DINNER';

export interface MainLunchMenu {
  id: number;
  mealType: LunchMealType;
  menuName: string;
  price: number;
  calorie: number;
  schoolInfo: string;
  components: string[];
  likeCount: number;
  dislikeCount: number;
  likedByMe?: boolean;
  dislikedByMe?: boolean;
}