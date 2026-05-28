import type { MainRankingItem } from './types';

export const mockRankings: MainRankingItem[] = [
  {
    id: 1,
    rank: 1,
    title: '치킨마요 덮밥',
    cafeteriaName: '학생식당 A',
    mealTime: '점심',
    likedCount: 132,
    dislikedCount: 6,
    score: 126,
    changeText: '지난주보다 2계단 상승',
  },
  {
    id: 2,
    rank: 2,
    title: '돈코츠 라멘',
    cafeteriaName: '학생식당 B',
    mealTime: '점심',
    likedCount: 119,
    dislikedCount: 9,
    score: 110,
    changeText: '지난주와 동일',
  },
  {
    id: 3,
    rank: 3,
    title: '불향 제육볶음',
    cafeteriaName: '교직원식당',
    mealTime: '점심',
    likedCount: 97,
    dislikedCount: 12,
    score: 85,
    changeText: '지난주보다 1계단 하락',
  },
];
