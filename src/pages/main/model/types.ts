export type MainTab = 'ROOM' | 'LUNCH' | 'RANKING' | 'BOARD';

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

export interface MainRankingItem {
  id: number;
  rank: number;
  title: string;
  cafeteriaName: string;
  mealTime: string;
  likedCount: number;
  changeText: string;
}

export interface MainBoardPost {
  id: number;
  category: 'FREE' | 'REVIEW' | 'INFO' | 'TALK';
  title: string;
  author: string;
  summary: string;
  content: string;
  likedCount: number;
  commentCount: number;
  createdAt: string;
}

export interface MainBoardComment {
  id: number;
  postId: number;
  author: string;
  content: string;
  likedCount: number;
  createdAt: string;
  isMine: boolean;
}
