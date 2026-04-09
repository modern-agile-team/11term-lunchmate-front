import type { MainBoardComment } from './types';

export const mockBoardComments: MainBoardComment[] = [
  {
    id: 1,
    postId: 1,
    author: '학식헌터',
    content: '방금 보고 왔는데 줄은 길어도 회전은 빨라요. 10분 안쪽으로 들어갈 수 있을 것 같아요.',
    likedCount: 4,
    createdAt: '2026-03-30T03:14:00.000Z',
    isMine: false,
  },
  {
    id: 2,
    postId: 1,
    author: '배고픈호랑이',
    content: '오 바로 알려주셔서 감사합니다! 조금 서둘러 가봐야겠네요.',
    likedCount: 2,
    createdAt: '2026-03-30T03:16:00.000Z',
    isMine: true,
  },
  {
    id: 3,
    postId: 2,
    author: '매운맛사랑',
    content: '저도 오늘 먹었는데 계란찜이 생각보다 잘 어울렸어요.',
    likedCount: 6,
    createdAt: '2026-03-30T02:55:00.000Z',
    isMine: false,
  },
  {
    id: 4,
    postId: 3,
    author: '새내기밥친구',
    content: '금요일 특식 메뉴가 뭔지도 추후에 공유되면 좋겠어요!',
    likedCount: 3,
    createdAt: '2026-03-30T02:30:00.000Z',
    isMine: false,
  },
];
