import type { MainLunchMenu } from './types';

export const mockLunchMenus: MainLunchMenu[] = [
  {
    id: 1,
    cafeteriaName: '학생식당 A',
    mealTime: '점심',
    title: '불고기 덮밥',
    description: '맑은 장국, 김치, 샐러드와 함께 나오는 든든한 한 끼',
    detailDescription:
      '달짝지근한 불고기와 따끈한 밥이 어우러진 무난한 인기 메뉴예요. 점심시간에 부담 없이 먹기 좋고, 샐러드와 장국까지 같이 나와서 만족도가 높아요.',
    price: 5500,
    calorie: 742,
    sideMenus: ['맑은 장국', '배추김치', '샐러드'],
    location: '학생식당 A 1층',
    spicyLevel: '순한맛',
    likedCount: 82,
    dislikedCount: 7,
  },
  {
    id: 2,
    cafeteriaName: '학생식당 B',
    mealTime: '점심',
    title: '돈까스 정식',
    description: '바삭한 돈까스와 크림스프, 양배추 샐러드 구성',
    detailDescription:
      '겉은 바삭하고 속은 촉촉한 돈까스를 중심으로 구성된 정식 메뉴예요. 진한 크림스프와 샐러드 조합이 잘 어울려서 든든하게 먹기 좋아요.',
    price: 6000,
    calorie: 915,
    sideMenus: ['크림스프', '양배추 샐러드', '단무지'],
    location: '학생식당 B 2층',
    spicyLevel: '순한맛',
    likedCount: 74,
    dislikedCount: 12,
  },
  {
    id: 3,
    cafeteriaName: '교직원식당',
    mealTime: '점심',
    title: '닭갈비 볶음',
    description: '매콤한 닭갈비와 계란찜, 나물 반찬이 함께 제공',
    detailDescription:
      '불향이 은은하게 살아 있는 닭갈비 볶음 메뉴예요. 계란찜과 나물 반찬이 함께 제공돼서 매콤함을 중화해주고, 든든한 점심 메뉴로 인기가 많아요.',
    price: 6500,
    calorie: 688,
    sideMenus: ['계란찜', '콩나물무침', '무생채'],
    location: '교직원식당 1층',
    spicyLevel: '보통맛',
    likedCount: 96,
    dislikedCount: 9,
  },
];
