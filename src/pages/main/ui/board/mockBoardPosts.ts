import type { MainBoardPost } from './types';

export const mockBoardPosts: MainBoardPost[] = [
  {
    id: 1,
    category: 'FREE',
    title: '오늘 학생식당 줄 어땠나요?',
    author: '배고픈호랑이',
    summary: '12시쯤 가려는데 대기 줄 길이랑 회전 속도 궁금해요.',
    content:
      '오늘 12시 10분쯤 학생식당 갈 예정인데 혹시 지금 줄 분위기 어떤가요?\n메뉴 빨리 빠지는 편인지, 자리 회전 속도도 궁금합니다.',
    likedCount: 14,
    commentCount: 8,
    createdAt: '2026-03-30T03:10:00.000Z',
  },
  {
    id: 2,
    category: 'REVIEW',
    title: '교직원식당 닭갈비 생각보다 괜찮았어요',
    author: '점심탐험가',
    summary: '양념이 자극적이지 않고 반찬 구성이 좋아서 만족했습니다.',
    content:
      '오늘 교직원식당 닭갈비 먹었는데 생각보다 양도 넉넉하고 반찬 구성이 좋았어요.\n맵기 세지 않고 무난해서 다음 주에도 다시 먹을 의향 있습니다.',
    likedCount: 22,
    commentCount: 11,
    createdAt: '2026-03-30T02:48:00.000Z',
  },
  {
    id: 3,
    category: 'INFO',
    title: '이번 주 학식 이벤트 메뉴 일정 공유',
    author: '학생회공식',
    summary: '수요일에는 분식데이, 금요일에는 특식이 예정되어 있다고 합니다.',
    content:
      '이번 주 학식 이벤트 메뉴 일정을 공유드립니다.\n수요일은 분식데이, 금요일은 특식 메뉴가 예정되어 있으니 참고해주세요.',
    likedCount: 31,
    commentCount: 5,
    createdAt: '2026-03-30T02:20:00.000Z',
  },
];
