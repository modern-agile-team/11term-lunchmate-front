export interface MainRoom {
  id: number;
  title: string;
  roomType: 'MIXED' | 'FEMALE' | 'MALE';
  minAge: number;
  maxAge: number;
  currentCount: number;
  capacity: number;
  place: string;
  lunchAt: string;
}

export type MainTab = 'ROOM' | 'LUNCH' | 'RANKING' | 'BOARD';

export interface MainLunchMenu {
  id: number;
  cafeteriaName: string;
  mealTime: string;
  title: string;
  description: string;
  price: string;
  calorie: string;
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
  likedCount: number;
  commentCount: number;
  createdAt: string;
}
