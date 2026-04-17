export interface MainLunchMenu {
  id: number;
  cafeteriaName: string;
  mealTime: string;
  title: string;
  description: string;
  detailDescription: string;
  price: number;
  calorie: number;
  sideMenus: string[];
  location: string;
  spicyLevel: '순한맛' | '보통맛' | '매운맛';
  likedCount: number;
  dislikedCount: number;
}
