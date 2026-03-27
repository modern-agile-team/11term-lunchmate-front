import type { MainLunchMenu } from '../model/types';

export const mockLunchMenus: MainLunchMenu[] = [
  {
    id: 1,
    cafeteriaName: '학생식당 A',
    mealTime: '점심',
    title: '불고기 덮밥',
    description: '맑은 장국, 김치, 샐러드와 함께 나오는 든든한 한 끼',
    price: '5,500원',
    calorie: '742kcal',
    likedCount: 82,
    dislikedCount: 7,
  },
  {
    id: 2,
    cafeteriaName: '학생식당 B',
    mealTime: '점심',
    title: '돈까스 정식',
    description: '바삭한 돈까스와 크림스프, 양배추 샐러드 구성',
    price: '6,000원',
    calorie: '915kcal',
    likedCount: 74,
    dislikedCount: 12,
  },
  {
    id: 3,
    cafeteriaName: '교직원식당',
    mealTime: '점심',
    title: '닭갈비 볶음',
    description: '매콤한 닭갈비와 계란찜, 나물 반찬이 함께 제공',
    price: '6,500원',
    calorie: '688kcal',
    likedCount: 96,
    dislikedCount: 9,
  },
];
