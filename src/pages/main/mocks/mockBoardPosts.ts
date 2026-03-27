import type { MainBoardPost } from '../model/types';

export const mockBoardPosts: MainBoardPost[] = [
  {
    id: 1,
    category: 'FREE',
    title: '오늘 학생식당 줄 어땠나요?',
    author: '배고픈호랑이',
    summary: '12시쯤 가려는데 대기 줄 길이랑 회전 속도 궁금해요.',
    likedCount: 14,
    commentCount: 8,
    createdAt: '10분 전',
  },
  {
    id: 2,
    category: 'REVIEW',
    title: '교직원식당 닭갈비 생각보다 괜찮았어요',
    author: '점심탐험가',
    summary: '양념이 자극적이지 않고 반찬 구성이 좋아서 만족했습니다.',
    likedCount: 22,
    commentCount: 11,
    createdAt: '32분 전',
  },
  {
    id: 3,
    category: 'INFO',
    title: '이번 주 학식 이벤트 메뉴 일정 공유',
    author: '학생회공식',
    summary: '수요일에는 분식데이, 금요일에는 특식이 예정되어 있다고 합니다.',
    likedCount: 31,
    commentCount: 5,
    createdAt: '1시간 전',
  },
];
